import joblib
import pandas as pd
import json

model = joblib.load(r"c:\Users\mggeh\OneDrive\Desktop\Anti-Gravity\proppluse\backend\models\house_price_xgb_model.joblib")
with open(r"c:\Users\mggeh\OneDrive\Desktop\Anti-Gravity\proppluse\backend\models\model_metadata.json") as f:
    meta = json.load(f)

print("Features expected:", meta["features"])

# Create a test sample
sample = pd.DataFrame([{
    "number_of_bedrooms": 3,
    "number_of_bathrooms": 2.0,
    "living_area": 1800,
    "lot_area": 5000,
    "number_of_floors": 2.0,
    "waterfront_present": 0,
    "number_of_views": 0,
    "condition_of_the_house": 4,
    "grade_of_the_house": 8,
    "area_of_the_house_excluding_basement": 1800,
    "area_of_the_basement": 0,
    "built_year": 2018,
    "renovation_year": 0,
    "postal_code": 122003,
    "lattitude": 52.88,
    "longitude": -114.47,
    "living_area_renov": 1800,
    "lot_area_renov": 5000,
    "number_of_schools_nearby": 2,
    "distance_from_the_airport": 50
}])

pred = model.predict(sample[meta["features"]])
print(f"Predicted price for sample: INR {pred[0]:,.2f}")
