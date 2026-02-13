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

# Placeholder for LLM Service (to be implemented in llm_service.py)
# from llm_service import parse_prompt_to_params

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "antigravity-backend"}

@app.post("/generate")
async def generate_model(request: GenerationRequest):
    """
    Generates a 3D model based on the input prompt.
    Currently maps prompt to hardcoded parameters for demonstration.
    """
    try:
        # TODO: Integrate LLM here to parse request.prompt -> CadParameters
        # For now, we'll use a simple keyword match
        
        prompt_lower = request.prompt.lower()
        
        if "gridfinity" in prompt_lower:
            # Default 1x1 bin
            result = generate_gridfinity_bin(width=1, depth=1, height=3)
        elif "hsw" in prompt_lower:
             # Default HSW plug
            result = generate_hsw_plug()
        else:
            raise HTTPException(status_code=400, detail="Unknown request type. Try 'gridfinity' or 'hsw'.")

        # Export logic
        with tempfile.NamedTemporaryFile(delete=False, suffix=".glb") as tmp:
            # CadQuery export
            # Note: GLTF export in CadQuery might need specific handling or an exporter
            # For simplicity in this step, we pretend to export. 
            # Real implementation will function properly.
            
            # Using basic export for now to verify CQ is working
            cq.exporters.export(result, tmp.name, exportType="GLTF")
            
            return FileResponse(tmp.name, media_type="model/gltf-binary", filename="model.glb")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_gridfinity_bin(width=1, depth=1, height=3):
    """
    Generates a Gridfinity bin using cadquery/cq-gridfinity.
    """
    # Placeholder: Simple box for now until specific library is fully integrated
    # Real implementation will use cq-gridfinity classes
    box = cq.Workplane("XY").box(42 * width, 42 * depth, 7 * height)
    return box

def generate_hsw_plug():
    """
    Generates a generic HSW plug.
    """
    # Placeholder: Hexagon
    # Hexagon radius approx 12mm flat-to-flat? standard is roughly that.
    plug = cq.Workplane("XY").polygon(6, 12).extrude(10)
    return plug

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
