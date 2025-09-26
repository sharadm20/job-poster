
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uvicorn
from pdfminer.high_level import extract_text
import re

app = FastAPI()

class ParseResult(BaseModel):
    name: str | None
    email: str | None
    phone: str | None
    skills: list[str] = []
    text: str

@app.post('/parse', response_model=ParseResult)
async def parse_resume(file: UploadFile = File(...)):
    contents = await file.read()
    with open('/tmp/uploaded_resume.pdf','wb') as f:
        f.write(contents)
    text = extract_text('/tmp/uploaded_resume.pdf')
    email = re.search(r'[\\w\\.-]+@[\\w\\.-]+', text)
    phone = re.search(r'(\\+?\\d[\\d\\-\\s]{7,}\\d)', text)
    skills = []
    if 'Rust' in text:
        skills.append('Rust')
    if 'Actix' in text:
        skills.append('Actix')
    return ParseResult(name=None, email=email.group(0) if email else None, phone=phone.group(0) if phone else None, skills=skills, text=text)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8001)
