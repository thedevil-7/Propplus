import os
import re

src_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src')

# Mapping of replacements for PropertyMap2D.jsx
property_map_replacements = [
    (r"Lower Price \(< 1Cr\)", r"Lower Price (< 100 Lakhs)"),
    (r"Mid Price \(1Cr - 2Cr\)", r"Mid Price (100 - 200 Lakhs)"),
    (r"Premium \(2Cr - 5Cr\)", r"Premium (200 - 500 Lakhs)"),
    (r"High-End \(5Cr - 10Cr\)", r"High-End (500 - 1000 Lakhs)"),
    (r"Ultra-Luxury \(10Cr\+\)", r"Ultra-Luxury (1000+ Lakhs)"),
    (r"₹\{mapMode === 'price' \? p\.priceLakhs\.toFixed\(2\) \+ 'L' : Math\.round\(p\.pricePerSqFt\) \+ '/sqft'\}", r"{mapMode === 'price' ? formatPropertyValue(p.priceLakhs) : '₹' + Math.round(p.pricePerSqFt) + '/sqft'}"),
    (r"< 1Cr", r"< 100 Lakhs"),
    (r"1Cr–2Cr", r"100–200 Lakhs"),
    (r"2Cr–5Cr", r"200–500 Lakhs"),
    (r"5Cr–10Cr", r"500–1000 Lakhs"),
    (r"10Cr\+", r"1000+ Lakhs"),
]

# Mapping of replacements for DynamicFloorPlan.jsx
dynamic_floor_plan_replacements = [
    (r"₹\{priceLakhs\} \{priceLakhs > 100 \? 'Cr' : 'Lakhs'\}", r"{formatPropertyValue(priceLakhs).replace('₹', '')}"),
]

def apply_replacements(filepath, replacements, add_import=False):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for pattern, replacement in replacements:
        modified = re.sub(pattern, replacement, modified)
    
    if add_import and modified != content:
        if "import { formatPropertyValue }" not in modified:
            import_stmt = "import { formatPropertyValue } from '../../utils/formatters';\n"
            last_import = modified.rfind('import ')
            if last_import != -1:
                end_of_last_import = modified.find('\n', last_import)
                modified = modified[:end_of_last_import+1] + import_stmt + modified[end_of_last_import+1:]
            else:
                modified = import_stmt + modified

    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated {filepath}")

apply_replacements(os.path.join(src_dir, 'components', 'property', 'PropertyMap2D.jsx'), property_map_replacements, False)
apply_replacements(os.path.join(src_dir, 'components', 'architectural', 'DynamicFloorPlan.jsx'), dynamic_floor_plan_replacements, True)

print("Done phase 2")
