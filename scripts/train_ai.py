import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_validate
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error, r2_score
from xgboost import XGBRegressor
import joblib

def run_pipeline():
    dataset_path = r"c:\Users\mggeh\OneDrive\Desktop\Anti-Gravity\proppluse\data\House Price India.csv"
    if not os.path.exists(dataset_path):
        dataset_path = r"C:\Users\mggeh\Downloads\House Price India.csv"
    
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"Initial shape: {df.shape}")
    
    # 1. Schema understanding and cleaning
    # Check nulls
    null_counts = df.isnull().sum()
    print("Null count total:", null_counts.sum())
    
    # Rename columns to standardized format
    df.columns = [col.strip().lower().replace(' ', '_').replace('(', '_').replace(')', '') for col in df.columns]
    
    # Drop non-predictive identifier columns
    drop_cols = ['id']
    if 'date' in df.columns:
        drop_cols.append('date')
    
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])
    print("Cleaned columns:", list(df.columns))
    
    # Check for invalid rows (e.g. price <= 0, bedrooms <= 0, living area <= 0)
    invalid_mask = (df['price'] <= 0) | (df['living_area'] <= 0)
    print(f"Invalid rows detected: {invalid_mask.sum()}")
    df = df[~invalid_mask]
    
    # Features and Target
    target_col = 'price'
    feature_cols = [c for c in df.columns if c != target_col]
    X = df[feature_cols]
    y = df[target_col]
    
    # 2. Strict Train-Test Split (80/20) with fixed random seed
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    print(f"Train size: {X_train.shape}, Test size: {X_test.shape}")
    
    # 3. Model Training & Comparison
    models = {
        "Naive Mean Baseline": None,
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=10.0),
        "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=16, random_state=42, n_jobs=-1),
        "XGBoost Regressor": XGBRegressor(n_estimators=200, learning_rate=0.08, max_depth=6, subsample=0.85, colsample_bytree=0.85, random_state=42, n_jobs=-1)
    }
    
    results = {}
    fitted_models = {}
    
    # Compute baseline
    mean_price = y_train.mean()
    y_pred_baseline = np.full_like(y_test, mean_price)
    results["Naive Mean Baseline"] = {
        "RMSE": float(np.sqrt(mean_squared_error(y_test, y_pred_baseline))),
        "MAE": float(mean_absolute_error(y_test, y_pred_baseline)),
        "MAPE": float(mean_absolute_percentage_error(y_test, y_pred_baseline)),
        "R2": float(r2_score(y_test, y_pred_baseline)),
        "Train_R2": 0.0
    }
    
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    
    for name, model in models.items():
        if model is None:
            continue
        print(f"\n--- Training {name} ---")
        
        # 5-Fold Cross-Validation on training data
        cv_scores = cross_validate(model, X_train, y_train, cv=kf, scoring=['r2', 'neg_root_mean_squared_error'])
        cv_r2 = float(np.mean(cv_scores['test_r2']))
        cv_rmse = float(-np.mean(cv_scores['test_neg_root_mean_squared_error']))
        
        # Fit on full training set
        model.fit(X_train, y_train)
        fitted_models[name] = model
        
        # Predict on holdout test set
        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)
        
        train_r2 = float(r2_score(y_train, y_pred_train))
        test_r2 = float(r2_score(y_test, y_pred_test))
        test_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_test)))
        test_mae = float(mean_absolute_error(y_test, y_pred_test))
        test_mape = float(mean_absolute_percentage_error(y_test, y_pred_test))
        
        results[name] = {
            "CV_R2 (5-Fold)": round(cv_r2, 4),
            "CV_RMSE (5-Fold)": round(cv_rmse, 2),
            "Train_R2": round(train_r2, 4),
            "Test_R2": round(test_r2, 4),
            "RMSE": round(test_rmse, 2),
            "MAE": round(test_mae, 2),
            "MAPE": round(test_mape, 4)
        }
        print(f"{name} Results: R²={test_r2:.4f}, RMSE={test_rmse:.2f}, MAE={test_mae:.2f}, MAPE={test_mape*100:.2f}%")

    # 4. Feature Importance from best model (XGBoost)
    best_model_name = "XGBoost Regressor"
    best_model = fitted_models[best_model_name]
    
    importances = best_model.feature_importances_
    feat_imp = sorted(
        [{"feature": col, "importance": round(float(imp) * 100, 2)} for col, imp in zip(feature_cols, importances)],
        key=lambda x: x["importance"],
        reverse=True
    )
    
    print("\nTop 10 Feature Importances (%):")
    for f in feat_imp[:10]:
        print(f"  {f['feature']}: {f['importance']}%")
        
    # Save model artifacts
    artifacts_dir = r"c:\Users\mggeh\OneDrive\Desktop\Anti-Gravity\proppluse\src\models"
    os.makedirs(artifacts_dir, exist_ok=True)
    
    model_save_path = os.path.join(artifacts_dir, "house_price_xgb_model.joblib")
    joblib.dump(best_model, model_save_path)
    print(f"\nSaved best model to: {model_save_path}")
    
    # Save metadata & metrics
    meta = {
        "dataset": "House Price India",
        "sample_count": len(df),
        "target": target_col,
        "features": feature_cols,
        "best_model": best_model_name,
        "metrics": results,
        "feature_importance": feat_imp
    }
    
    meta_save_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(meta_save_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"Saved model metadata to: {meta_save_path}")

    # Also generate a lightweight JS/JSON predictor config for instant client-side prediction in PropPulse
    # We can save feature coefficients / scaling factors or decision stumps
    # And save test samples for real demonstration
    sample_test = X_test.head(5).copy()
    sample_test['actual_price'] = y_test.head(5).values
    sample_test['predicted_price'] = best_model.predict(X_test.head(5)).round(2)
    print("\nSample Predictions vs Actual:")
    print(sample_test[['living_area', 'number_of_bedrooms', 'grade_of_the_house', 'actual_price', 'predicted_price']])

if __name__ == "__main__":
    run_pipeline()
