import cadquery as cq

def generate_gridfinity_bin(width_units: int, depth_units: int, height_units: int, holes: bool = True) -> cq.Workplane:
    """
    Generates a Gridfinity bin.
    
    Args:
        width_units: Number of grid units in X (42mm pitch)
        depth_units: Number of grid units in Y (42mm pitch)
        height_units: Number of height units (7mm pitch, includes base)
        holes: Whether to include magnet holes in the base
    
    Returns:
        cq.Workplane: The generated 3D object
    """
    
    # Constants
    PITCH = 42.0
    TOLERANCE = 0.5  # Standard gridfinity bin is 42 - 0.5 = 41.5mm
    HEIGHT_PITCH = 7.0
    BASE_HEIGHT = 5.0 # Height of the solid base part
    LIP_HEIGHT = 4.0  # Height of the top lip
    
    total_width = width_units * PITCH - TOLERANCE
    total_depth = depth_units * PITCH - TOLERANCE
    total_height = height_units * HEIGHT_PITCH
    
    # create the main block
    bin_obj = (
        cq.Workplane("XY")
        .box(total_width, total_depth, total_height)
        .edges("|Z")
        .fillet(7.5/2) # Standard gridfinity fillet radius approx
    )
    
    # Hollow out the inside
    # Wall thickness usually ~1.2mm to 2mm
    WALL_THICKNESS = 1.2
    FLOOR_THICKNESS = 1.5 # Internal floor thickness
    
    # Determine pocket size
    pocket_width = total_width - 2 * WALL_THICKNESS
    pocket_depth = total_depth - 2 * WALL_THICKNESS
    pocket_height = total_height - BASE_HEIGHT - LIP_HEIGHT # Approximate depth
    
    # We essentially want to shell from top, but let's do a cut for control
    # Position cut starting from top face going down
    
    # Simple shell for robustness in this demo
    bin_obj = bin_obj.faces("+Z").shell(-WALL_THICKNESS)

    # Add the Lip (Gridfinity specific lip profile is complex, simplified here)
    # The shell operation creates a uniform wall. The lip usually steps out.
    # For this simplified version, we'll stick to a basic container.
    
    # Generate Base Profiles (The critical part for stacking)
    # This needs to be subtractive from the bottom.
    
    # For each grid unit, we need a profile at the bottom
    for i in range(width_units):
        for j in range(depth_units):
            # Calculate center of this unit
            # Grid creates centers at:
            # -total/2 + PITCH/2 + i*PITCH
            
            x_pos = - (width_units * PITCH / 2) + (PITCH / 2) + (i * PITCH)
            y_pos = - (depth_units * PITCH / 2) + (PITCH / 2) + (j * PITCH)
            
            # Create the base cutout profile
            # This is a simplified representation of the gridfinity base profile
            # It should ideally be a loft or complex chamfer
            
            # Base square fit
            # Bottom most part is narrow, widens up
            
            # Cut magnet holes if requested
            if holes:
                # Magnet holes are usually 4 corners of the 42mm unit
                # 6.5mm diameter, 2.4mm depth
                magnet_dist = 26.0 / 2 # Radius from center
                
                # We need to cut holes at the 4 corners relative to unit center
                bin_obj = (
                    bin_obj.faces("<Z").workplane()
                    .center(x_pos, y_pos)
                    .rect(26, 26, forConstruction=True)
                    .vertices()
                    .hole(6.5, 2.4)
                )

    return bin_obj
