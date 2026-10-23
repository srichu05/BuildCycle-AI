"""Initial schema for analyses and detections

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-10-23 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create analyses table
    op.create_table(
        'analyses',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('image_sha256', sa.String(length=64), nullable=True),
        sa.Column('image_width', sa.Integer(), nullable=False),
        sa.Column('image_height', sa.Integer(), nullable=False),
        sa.Column('model_name', sa.String(length=100), nullable=False),
        sa.Column('model_version', sa.String(length=100), nullable=True),
        sa.Column('model_task', sa.String(length=30), server_default='detect', nullable=False),
        sa.Column('inference_time_ms', sa.Integer(), nullable=True),
        sa.Column('total_detections', sa.Integer(), server_default='0', nullable=False),
        sa.Column('composition_json', sa.JSON(), nullable=False),
        sa.Column('recommendations_json', sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_analyses_created_at_desc', 'analyses', [sa.text('created_at DESC')])
    op.create_index('idx_analyses_model_name', 'analyses', ['model_name'])

    # 2. Create detections table
    op.create_table(
        'detections',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('analysis_id', sa.Uuid(), nullable=False),
        sa.Column('class_name', sa.String(length=100), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('x1', sa.Float(), nullable=False),
        sa.Column('y1', sa.Float(), nullable=False),
        sa.Column('x2', sa.Float(), nullable=False),
        sa.Column('y2', sa.Float(), nullable=False),
        sa.Column('bbox_area_percent', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_detections_analysis_id', 'detections', ['analysis_id'])


def downgrade() -> None:
    op.drop_index('idx_detections_analysis_id', table_name='detections')
    op.drop_table('detections')
    op.drop_index('idx_analyses_model_name', table_name='analyses')
    op.drop_index('idx_analyses_created_at_desc', table_name='analyses')
    op.drop_table('analyses')
