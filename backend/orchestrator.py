"""
ReviewPulse Orchestrator (v4)
=============================
Single call, all tools, no answerFormat (API rejects nested schemas).
JSON structure requested in the instructions instead, then extracted.
"""

import os
import re
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from subconscious import Subconscious
from dotenv import load_dotenv

load_dotenv()

client = Subconscious(api_key=os.getenv("SUBCONSCIOUS_API_KEY"))
executor = ThreadPoolExecutor(max_workers=4)

DEFAULT_ENGINE = os.getenv("DEFAULT_ENGINE", "tim-claude")


def _build_task(product: str) -> dict:
    return {
        "engine": DEFAULT_ENGINE,
        "input": {
            "instructions": (
                f"Give me a comprehensive review analysis of '{product}' from all "
                f"the social media and sources that you have access to.\n\n"
                f"Search for real user opinions on Reddit, Twitter/X, forums, and "
                f"review sites. Search news for professional reviews and expert "
                f"verdicts. Search for the most recent content from the last 7 days.\n\n"
                f"Cite your sources throughout. Be thorough and balanced.\n\n"
                f"After your research, you MUST end your response with a JSON block "
                f"wrapped in ```json and ``` tags. The JSON must have this exact structure:\n\n"
                f'{{"overallScore": 7.5, "sentimentBreakdown": {{"positive": 60, "neutral": 25, "negative": 15}}, '
                f'"topPros": [{{"point": "Example advantage", "frequency": "Mentioned often"}}], '
                f'"topCons": [{{"point": "Example disadvantage", "frequency": "Mentioned sometimes"}}], '
                f'"keyThemes": ["theme1", "theme2"], '
                f'"painPoints": ["issue to consider before buying"], '
                f'"recommendation": {{"verdict": "Buy", "reasoning": "Brief explanation"}}, '
                f'"sources": [{{"name": "Source Name", "type": "social", "summary": "What they said"}}]}}\n\n'
                f"For verdict use exactly one of: Buy, Skip, Wait\n"
                f"For source type use exactly one of: social, press, community\n"
                f"Include at least 5 pros, 5 cons, 3 themes, 3 pain points, and 5 sources."
            ),
            "tools": [
                {"type": "platform", "id": "web_search"},
                {"type": "platform", "id": "news_search"},
                {"type": "platform", "id": "fresh_search"},
            ],
        },
        "options": {"await_completion": True},
    }


def _run_subconscious(task: dict) -> str:
    try:
        run = client.run(**task)
        if run.result and run.result.answer:
            print("=== RAW RESPONSE (first 500 chars) ===")
            print(run.result.answer[:500])
            print("=== END ===")
            return run.result.answer
        print("=== NO RESULT ===", run)
        return json.dumps({"error": "No result returned"})
    except Exception as e:
        print("=== EXCEPTION ===", str(e))
        return json.dumps({"error": str(e)})


def _extract_json(text: str) -> dict:
    """Try multiple strategies to pull JSON from the agent response."""
    if not text:
        return {"overallScore": 0, "rawAnswer": "", "parseError": True}

    # Strategy 1: ```json ... ``` fenced block
    match = re.search(r'```json\s*\n?(.*?)\n?\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Strategy 2: Find outermost balanced { ... }
    start = text.find("{")
    if start >= 0:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start:i + 1])
                    except json.JSONDecodeError:
                        break

    # Strategy 3: Maybe the whole response is JSON
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass

    return {"overallScore": 0, "rawAnswer": text, "parseError": True}


async def analyze_product(product: str) -> dict:
    loop = asyncio.get_event_loop()

    task = _build_task(product)
    raw_result = await loop.run_in_executor(executor, _run_subconscious, task)

    report = _extract_json(raw_result)

    return {
        "product": product,
        "report": report,
        "rawData": raw_result[:3000] if raw_result else "",
    }