from app.models.institution import Institution

def test_database_session(db):
    inst = Institution(
        name="Test Hospital",
        registration_number="REG-TEST-001",
        address="Test Address, City",
        latitude=18.5204,
        longitude=73.8567,
        reported_staff=10,
        reported_beneficiaries=100
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)

    fetched = db.query(Institution).filter(Institution.id == inst.id).first()
    assert fetched is not None
    assert fetched.name == "Test Hospital"

def test_database_rollback(db):
    inst1 = Institution(
        name="Inst 1",
        registration_number="REG-DUP",
        address="Addr 1",
        latitude=1.0,
        longitude=1.0
    )
    db.add(inst1)
    db.commit()

    inst2 = Institution(
        name="Inst 2",
        registration_number="REG-DUP",
        address="Addr 2",
        latitude=2.0,
        longitude=2.0
    )
    db.add(inst2)
    try:
        db.commit()
    except Exception:
        db.rollback()

    assert db.query(Institution).filter(Institution.registration_number == "REG-DUP").count() == 1
