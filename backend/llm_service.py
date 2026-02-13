from typing import Dict, Any
import json

def parse_prompt_to_params(prompt: str) -> Dict[str, Any]:
    """
    Mock LLM parser.
    In production, this would call GPT-4o or similar with a JSON Schema.
    """
    prompt = prompt.lower()
    
    if "gridfinity" in prompt:
        return {
            "type": "gridfinity_bin",
            "params": {
                "width": 1,
                "depth": 1,
                "height": 3,
                "holes": True
            }
        }
    elif "hsw" in prompt:
        return {
            "type": "hsw_plug",
            "params": {
                "variant": "standard"
            }
        }
    else:
        return {
            "type": "unknown",
            "params": {}
        }
