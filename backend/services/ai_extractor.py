import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("NVIDIA_BASE_URL"),
    api_key=os.getenv("NVIDIA_API_KEY")
)

EXTRACTION_PROMPT = '''You are a legal AI assistant specialized in Indian court judgments.

Extract ALL directives/orders from the following court judgment text.
Return ONLY a valid JSON array with no explanation, no preamble, no markdown.

For each directive extract:
{{
  "case_number": "case number from judgment",
  "court_name": "name of court",
  "judgment_date": "date of judgment",
  "petitioner": "petitioner name",
  "respondent": "respondent name",
  "directive_text": "exact directive or order given",
  "responsible_authority": "who must execute this order",
  "deadline_days": null,
  "deadline_date": "calculated deadline date if mentioned",
  "directive_type": "one of: infrastructure/compensation/criminal_action/environmental/service_delivery/contempt/interim_relief",
  "penalty_if_missed": "consequence if not complied",
  "proof_required": "what proof of compliance is needed",
  "confidence_score": 0.95
}}

Judgment Text:
{text}

Return ONLY the JSON array. Nothing else.'''

def extract_directives(judgment_text: str) -> list:
    try:
        text = judgment_text[:8000]
        prompt = EXTRACTION_PROMPT.format(text=text)
        response = client.chat.completions.create(
            model=os.getenv("NVIDIA_MODEL"),
            messages=[
                {
                    "role": "system",
                    "content": "You are a legal AI that extracts structured data from Indian court judgments. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=3000
        )
        raw_response = response.choices[0].message.content.strip()
        if raw_response.startswith("`"):
            raw_response = raw_response.split("`")[1]
            if raw_response.startswith("json"):
                raw_response = raw_response[4:]
        if raw_response.endswith("`"):
            raw_response = raw_response[:-3]
        raw_response = raw_response.strip()
        directives = json.loads(raw_response)
        if not isinstance(directives, list):
            directives = [directives]
        return directives
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return []
    except Exception as e:
        print(f"Extraction error: {e}")
        raise e
