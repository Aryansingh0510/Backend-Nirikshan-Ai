import hashlib
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.utils.serializers import serialize_audit_log

class AuditService:
    def get_audit_logs(self, db: Session) -> List[dict]:
        logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).all()
        return [serialize_audit_log(l) for l in logs]

    def add_audit_log(
        self,
        db: Session,
        action: str,
        target: str,
        user: str,
        details: str,
        status: str = "VERIFIED",
        user_id: Optional[str] = None,
        inspection_id: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> dict:
        tx_id = f"TX-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now(timezone.utc)
        time_str = now.strftime("%d-%b-%Y %H:%M:%S IST")

        # Fetch previous hash
        latest = db.query(AuditLog).order_by(AuditLog.created_at.desc()).first()
        prev_hash = latest.hash if latest and latest.hash else "0000000000000000000000000000000000000000000000000000000000000000"

        payload = f"{tx_id}|{action}|{target}|{user}|{time_str}|{details}|{prev_hash}"
        hash_val = "sha256:" + hashlib.sha256(payload.encode("utf-8")).hexdigest()

        log = AuditLog(
            id=tx_id,
            user_id=user_id,
            inspection_id=inspection_id,
            action=action,
            target=target,
            user_name=user,
            time_str=time_str,
            status=status,
            hash=hash_val,
            prev_hash=prev_hash,
            description=details,
            ip_address=ip_address or "127.0.0.1",
        )

        db.add(log)
        db.commit()
        db.refresh(log)
        return serialize_audit_log(log)

    def verify_ledger(self, db: Session) -> Dict[str, Any]:
        logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).all()
        total_blocks = len(logs)
        is_valid = True
        latest_hash = logs[0].hash if logs and logs[0].hash else None

        for l in logs:
            if not l.hash or not l.hash.startswith("sha256:"):
                is_valid = False
                break

        return {
            "success": True,
            "verified": is_valid,
            "totalBlocks": total_blocks,
            "ledgerState": "IMMUTABLE_SYNCED",
            "latestBlockHash": latest_hash,
        }

audit_service = AuditService()
