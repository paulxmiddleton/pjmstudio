# 3D Model Assets

This directory contains 3D model files for the ASCII 3D animation engine.

## Supported Formats

- **GLTF (.gltf, .glb)** - Primary format, recommended for web
- **OBJ (.obj)** - Fallback format, widely supported
- **STL (.stl)** - For simple geometry

## Organization

```
models/
├── test/           # Simple test models (cube, sphere, torus)
├── production/     # Production-ready models
└── samples/        # Example models for demonstration
```

## Optimization Guidelines

### For ASCII Rendering
- Keep polygon count reasonable (1K-10K triangles)
- Avoid overly complex geometry details
- Focus on strong silhouettes and recognizable shapes
- Test how models look when converted to ASCII characters

### Performance Considerations
- Models should be optimized for real-time rendering
- Consider LOD (Level of Detail) versions for complex models
- Keep file sizes under 1MB when possible
- Use GLTF for smaller file sizes and faster loading

## Naming Conventions

- Use descriptive names: `medieval-sword.glb`, `dragon-head.obj`
- Include complexity level: `cube-simple.glb`, `castle-detailed.gltf`
- Version numbers for iterations: `model-v1.glb`, `model-v2.glb`

## Sample Models Needed

For initial testing and development:
- `cube-simple.glb` - Basic cube geometry
- `sphere-smooth.glb` - Smooth sphere
- `torus-medium.glb` - Torus/donut shape
- `dragon-head.glb` - More complex medieval-themed model

## Integration Notes

Models are loaded via the ModelLoader class and should include:
- Proper materials (basic materials work best for ASCII conversion)
- Centered geometry (models should be centered at origin)
- Appropriate scale (models should fit within a reasonable bounding box)

## Development Workflow

1. Add model file to appropriate subdirectory
2. Test with ascii-test.html page
3. Validate ASCII conversion quality
4. Optimize if necessary
5. Document any special requirements or properties