from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import cadquery as cq
import uvicorn
import os
import tempfile
from starlette.responses import FileResponse

# Initialize FastAPI app
app = FastAPI(title="Antigravity CAD API", description="AI-Driven Parametric CAD Generation for Gridfinity & HSW")

# Data Models
class GenerationRequest(BaseModel):
    prompt: str
    target_format: str = "GLTF"  # GLTF, STEP, STL

class CadParameters(BaseModel):
    type: str  # "gridfinity_bin", "gridfinity_base", "hsw_plug", "hsw_wall"
    params: Dict[str, Any]

# from llm_service import parse_prompt_to_params
from llm_service import parse_prompt_to_params

from gridfinity_generator import generate_gridfinity_bin
from hsw_generator import generate_hsw_plug

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "antigravity-backend"}

@app.post("/generate")
async def generate_model(request: GenerationRequest):
    """
    Generates a 3D model based on the input prompt.
    """
    try:
        # Parse Request
        parsed_request = parse_prompt_to_params(request.prompt)
        req_type = parsed_request.get("type")
        params = parsed_request.get("params", {})
        
        result = None
        
        if req_type == "gridfinity_bin":
            result = generate_gridfinity_bin(
                width_units=params.get("width_units", 1),
                depth_units=params.get("depth_units", 1),
                height_units=params.get("height_units", 3),
                holes=params.get("holes", True)
            )
            
        elif req_type == "hsw_plug":
            result = generate_hsw_plug(
                variant=params.get("variant", "standard")
            )
            
        else:
            raise HTTPException(status_code=400, detail="Unknown request type. Try 'gridfinity 3x2' or 'hsw plug'.")

        # Export logic
        with tempfile.NamedTemporaryFile(delete=False, suffix=".glb") as tmp:
            # CadQuery export
            # Using basic export for now 
            cq.exporters.export(result, tmp.name, exportType="GLTF")
            
            return FileResponse(tmp.name, media_type="model/gltf-binary", filename="model.glb")

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
