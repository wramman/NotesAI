from unittest.mock import patch

def test_summarize_success(client):
    note = client.post("/notes", json={"title": "T", "content": "contenido largo"}).json()

    with patch("repositories.note_repository.resumir", return_value="Resumen simulado"):
        response = client.get(f"/notes/{note['id']}/summarize")

    assert response.status_code == 200
    assert response.json()["summary"] == "Resumen simulado"

def test_summarize_ollama_down(client):
    note = client.post("/notes", json={"title": "T", "content": "contenido"}).json()

    with patch("repositories.note_repository.resumir", side_effect=ConnectionError):
        response = client.get(f"/notes/{note['id']}/summarize")

    assert response.status_code != 200
    assert response.status_code == 503  
    response.json()["detail"]

    nota_actual = client.get(f"/notes/{note['id']}").json()
    assert nota_actual["content"] == "contenido"