def test_create_note(client):
    response = client.post("/notes", json={"title": "Mi nota", "content": "contenido"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Mi nota"
    assert data["is_deleted"] is False

def test_list_notes(client):
    client.post("/notes", json={"title": "Nota 1", "content": "a"})
    response = client.get("/notes")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_edit_note(client):
    created = client.post("/notes", json={"title": "Original", "content": "x"}).json()
    response = client.put(f"/notes/{created['id']}", json={"title": "Editado", "content": "y"})
    assert response.status_code == 200
    assert response.json()["title"] == "Editado"

def test_soft_delete_note(client):
    created = client.post("/notes", json={"title": "Borrar", "content": "x"}).json()
    response = client.delete(f"/notes/{created['id']}")
    assert response.status_code == 200

    # ya no debe aparecer en el listado
    listado = client.get("/notes").json()
    assert all(n["id"] != created["id"] for n in listado)