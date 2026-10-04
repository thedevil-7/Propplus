import os
import re

src_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src')

# Mapping of replacements for PropertyDetailView.jsx
property_detail_replacements = [
    (r"₹\{\(property\.predictedValue \* 1\.4\)\.toFixed\(2\)\} Cr", r"{formatPropertyValue(property.predictedValue * 1.4)}"),
    (r"\+₹\{\(property\.predictedValue \* 0\.4\)\.toFixed\(2\)\} Cr", r"+{formatPropertyValue(property.predictedValue * 0.4)}"),
    (r"₹\{comp\.price\} Cr", r"{formatPropertyValue(comp.price)}"),
    (r"₹\{property\.predictedValue\} <span style=\{\{ fontSize: '2rem', color: 'var\(--accent-blue\)' \}\}>Cr</span>", r"{formatPropertyValue(property.predictedValue)}"),
    (r"₹\{property\.priceRange \? property\.priceRange\[0\] : \(property\.predictedValue \* 0\.95\)\.toFixed\(1\)\} Cr", r"{formatPropertyValue(property.priceRange ? property.priceRange[0] : property.predictedValue * 0.95)}"),
    (r"₹\{property\.priceRange \? property\.priceRange\[1\] : \(property\.predictedValue \* 1\.05\)\.toFixed\(1\)\} Cr", r"{formatPropertyValue(property.priceRange ? property.priceRange[1] : property.predictedValue * 1.05)}"),
]

# Mapping of replacements for PredictView.jsx
predict_view_replacements = [
    (r"₹\{\(\(parseFloat\(area\) \* parseFloat\(userPriceSqft\)\) / 100000\)\.toFixed\(2\)\} Lakh", r"{formatPropertyValue((parseFloat(area) * parseFloat(userPriceSqft)) / 100000)}"),
    (r"₹\{predictionResult\.predictedValue\?\.toFixed\(2\)\} <span style=\{\{ fontSize: '2\.25rem', color: 'var\(--primary-500\)' \}\}>Lakhs</span>", r"{formatPropertyValue(predictionResult.predictedValue)}"),
]

# Mapping of replacements for LandingView.jsx
landing_view_replacements = [
    (r"const inCr = \(totalVal / 100\)\.toFixed\(2\);", r"const inCr = totalVal;"),
    (r"valueCr: inCr,", r"valueCr: inCr,"),
    (r"priceTag: '₹1\.35 Cr'", r"priceTag: '₹135 Lakhs'"),
    (r"priceTag: '₹2\.18 Cr'", r"priceTag: '₹218 Lakhs'"),
    (r"priceTag: '₹2\.95 Cr'", r"priceTag: '₹295 Lakhs'"),
    (r"priceTag: '₹1\.65 Cr'", r"priceTag: '₹165 Lakhs'"),
    (r"₹\{quickCalcResult\.valueCr\} Cr", r"{formatPropertyValue(quickCalcResult.valueCr)}"),
    (r"<span style=\{\{ fontSize: '1\.2rem', fontWeight: 700, color: '#3159C9' \}\}>Crore</span>", r""),
    (r"₹1\.27 Cr — ₹1\.42 Cr", r"₹127 Lakhs — ₹142 Lakhs"),
]

# Mapping of replacements for DashboardView.jsx
dashboard_view_replacements = [
    (r"₹1\.35 Cr", r"₹135 Lakhs"),
    (r"₹1\.35 <span style=\{\{ fontSize: '1\.4rem', fontWeight: 700, color: 'var\(--accent-blue\)' \}\}>Crore</span>", r"₹135 Lakhs"),
    (r"P10: ₹1\.27 Cr", r"P10: ₹127 Lakhs"),
    (r"Predicted: ₹1\.35 Cr", r"Predicted: ₹135 Lakhs"),
    (r"P90: ₹1\.42 Cr", r"P90: ₹142 Lakhs"),
]

# Mapping of replacements for ReportModal.jsx
report_modal_replacements = [
    (r"₹\{property\?\.predictedValue\?\.toFixed\(2\)\} Lakhs", r"{formatPropertyValue(property?.predictedValue)}"),
    (r"₹\{property\?\.priceRange\?\.\[0\] \|\| \(property\?\.predictedValue \* 0\.9\)\.toFixed\(2\)\} Lakhs", r"{formatPropertyValue(property?.priceRange?.[0] || property?.predictedValue * 0.9)}"),
    (r"₹\{property\?\.priceRange\?\.\[1\] \|\| \(property\?\.predictedValue \* 1\.1\)\.toFixed\(2\)\} Lakhs", r"{formatPropertyValue(property?.priceRange?.[1] || property?.predictedValue * 1.1)}"),
    (r"₹\{property\?\.predictedValue\?\.toFixed\(2\)\} Lakhs\.”", r"{formatPropertyValue(property?.predictedValue)}.”"),
]

# Mapping of replacements for PropertyMap2D.jsx
property_map_replacements = [
    (r"\{\(selectedProp\.priceLakhs \|\| selectedProp\.predictedValue\)\?\.toFixed\(2\)\} \{selectedProp\.priceLakhs \? 'L' : 'Cr'\}", r"{formatPropertyValue(selectedProp.priceLakhs || selectedProp.predictedValue).replace('₹', '')}"),
    (r"₹\{subjectPrice\.toFixed\(2\)\} Cr", r"{formatPropertyValue(subjectPrice)}"),
]

def apply_replacements(filepath, replacements, add_import=False):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for pattern, replacement in replacements:
        modified = re.sub(pattern, replacement, modified)
    
    if add_import and modified != content:
        import_stmt = "import { formatPropertyValue } from '../utils/formatters';\n"
        # Find the last import statement
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

apply_replacements(os.path.join(src_dir, 'views', 'PropertyDetailView.jsx'), property_detail_replacements, True)
apply_replacements(os.path.join(src_dir, 'views', 'PredictView.jsx'), predict_view_replacements, True)
apply_replacements(os.path.join(src_dir, 'views', 'LandingView.jsx'), landing_view_replacements, True)
apply_replacements(os.path.join(src_dir, 'views', 'DashboardView.jsx'), dashboard_view_replacements, True)
apply_replacements(os.path.join(src_dir, 'components', 'property', 'ReportModal.jsx'), report_modal_replacements, True)
apply_replacements(os.path.join(src_dir, 'components', 'property', 'PropertyMap2D.jsx'), property_map_replacements, True)

print("Done")
