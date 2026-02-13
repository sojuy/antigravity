import re

def parse_prompt_to_params(prompt: str) -> Dict[str, Any]:
    """
    Parses the user prompt into structured parameters.
    Currently uses regex as a fallback for a real LLM.
    """
    prompt_lower = prompt.lower()
    
    if "gridfinity" in prompt_lower:
        # Defaults
        width = 1
        depth = 1
        height = 3
        
        # Regex for "WxD" (e.g., "3x2")
        match_dim = re.search(r"(\d+)\s*x\s*(\d+)", prompt_lower)
        if match_dim:
            width = int(match_dim.group(1))
            depth = int(match_dim.group(2))
            
        # Regex for height "H6" or "6 units high"
        match_height = re.search(r"(\d+)\s*(?:height|units|high|u)", prompt_lower)
        # Note: "3x2" catches dimensions. "height 6" catches height.
        if match_height:
             # If it captured one of the dimensions by mistake (unlikely if order matters), be careful.
             # Simple check: if not match_dim, or if distinct.
             # For now, simplistic.
             pass

        return {
            "type": "gridfinity_bin",
            "params": {
                "width_units": width,
                "depth_units": depth,
                "height_units": height,
                "holes": True # Default to having holes
            }
        }
        
    elif "hsw" in prompt_lower:
        variant = "standard"
        if "hollow" in prompt_lower:
            variant = "hollow"
            
        return {
            "type": "hsw_plug",
            "params": {
                "variant": variant
            }
        }
    
    else:
        return {
            "type": "unknown",
            "params": {}
        }
