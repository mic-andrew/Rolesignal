"""Criteria library service — CRUD for reusable criteria templates."""

import logging
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.criteria_template import CriteriaTemplate
from app.schemas.criteria_library import (
    CriteriaTemplateCreate,
    CriteriaTemplateListResponse,
    CriteriaTemplateResponse,
    CriteriaTemplateUpdate,
    CriterionTemplateResponse,
    SubCriterionTemplateResponse,
)
from app.services import audit_service, criteria_generator
from app.services.file_parser import extract_text

logger = logging.getLogger(__name__)


async def list_templates(
    db: AsyncSession,
    org_id: uuid.UUID,
) -> CriteriaTemplateListResponse:
    """List all criteria templates for the organization."""
    result = await db.execute(
        select(CriteriaTemplate)
        .where(CriteriaTemplate.organization_id == org_id)
        .order_by(CriteriaTemplate.created_at.desc())
    )
    templates = result.scalars().all()
    data = [_to_response(t) for t in templates]
    return CriteriaTemplateListResponse(data=data, count=len(data))


async def get_template(
    db: AsyncSession,
    org_id: uuid.UUID,
    template_id: str,
) -> CriteriaTemplateResponse:
    """Get a single criteria template."""
    template = await _get_owned_template(db, org_id, template_id)
    return _to_response(template)


async def create_template(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: CriteriaTemplateCreate,
) -> CriteriaTemplateResponse:
    """Create a new criteria template."""
    criteria_json = _payload_to_json(payload.criteria)
    template = CriteriaTemplate(
        organization_id=org_id,
        name=payload.name,
        description=payload.description,
        criteria=criteria_json,
    )
    db.add(template)
    await db.flush()
    await db.refresh(template)

    await audit_service.log_event(
        db, org_id, user_id, "human",
        "Criteria Template Created",
        f"Created template '{payload.name}'",
        "📋",
    )

    logger.info(
        "criteria_template_created id=%s name=%s",
        template.id, payload.name,
    )
    return _to_response(template)


async def update_template(
    db: AsyncSession,
    org_id: uuid.UUID,
    template_id: str,
    payload: CriteriaTemplateUpdate,
) -> CriteriaTemplateResponse:
    """Update a criteria template."""
    template = await _get_owned_template(db, org_id, template_id)

    if payload.name is not None:
        template.name = payload.name
    if payload.description is not None:
        template.description = payload.description
    if payload.criteria is not None:
        template.criteria = _payload_to_json(payload.criteria)

    await db.flush()
    await db.refresh(template)

    logger.info("criteria_template_updated id=%s", template_id)
    return _to_response(template)


async def delete_template(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    template_id: str,
) -> None:
    """Delete a criteria template."""
    template = await _get_owned_template(db, org_id, template_id)
    name = template.name

    await db.delete(template)
    await db.flush()

    await audit_service.log_event(
        db, org_id, user_id, "human",
        "Criteria Template Deleted",
        f"Deleted template '{name}'",
        "🗑️",
    )
    logger.info("criteria_template_deleted id=%s", template_id)


async def import_from_document(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    file: UploadFile,
) -> CriteriaTemplateResponse:
    """Upload a criteria document, extract via LLM, and create template."""
    text = await extract_text(file)

    criteria = await criteria_generator.generate_criteria_from_text(text)

    filename = file.filename or "Imported Criteria"
    name = filename.rsplit(".", 1)[0][:100]

    template = CriteriaTemplate(
        organization_id=org_id,
        name=name,
        description=f"Imported from {filename}",
        criteria=criteria,
    )
    db.add(template)
    await db.flush()
    await db.refresh(template)

    await audit_service.log_event(
        db, org_id, user_id, "ai",
        "Criteria Imported from Document",
        f"Created template '{name}' from {filename}",
        "📄",
    )

    logger.info(
        "criteria_template_imported id=%s file=%s",
        template.id, filename,
    )
    return _to_response(template)


# ── Helpers ──────────────────────────────────────────────────────────────


def _payload_to_json(
    criteria: list,
) -> list[dict]:
    """Convert pydantic criterion inputs to JSON-serializable dicts."""
    return [
        {
            "name": c.name,
            "description": c.description,
            "weight": c.weight,
            "sub_criteria": [
                {
                    "name": sc.name,
                    "description": sc.description,
                    "weight": sc.weight,
                }
                for sc in c.sub_criteria
            ],
        }
        for c in criteria
    ]


async def _get_owned_template(
    db: AsyncSession,
    org_id: uuid.UUID,
    template_id: str,
) -> CriteriaTemplate:
    """Fetch template ensuring it belongs to the org."""
    result = await db.execute(
        select(CriteriaTemplate).where(
            CriteriaTemplate.id == template_id,
            CriteriaTemplate.organization_id == org_id,
        )
    )
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(
            status_code=404, detail="Criteria template not found"
        )
    return template


def _to_response(
    template: CriteriaTemplate,
) -> CriteriaTemplateResponse:
    """Convert ORM model to response schema."""
    criteria_json = template.criteria or []
    criteria = [
        CriterionTemplateResponse(
            name=c.get("name", ""),
            description=c.get("description", ""),
            weight=c.get("weight", 20),
            sub_criteria=[
                SubCriterionTemplateResponse(
                    name=sc.get("name", ""),
                    description=sc.get("description", ""),
                    weight=sc.get("weight", 50),
                )
                for sc in c.get("sub_criteria", [])
            ],
        )
        for c in criteria_json
    ]

    return CriteriaTemplateResponse(
        id=str(template.id),
        name=template.name,
        description=template.description,
        criteria=criteria,
        created_at=template.created_at.isoformat(),
        updated_at=template.updated_at.isoformat(),
    )
