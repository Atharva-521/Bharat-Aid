from flask import Flask, request, jsonify
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

def preprocess_data(date_data, systolic_data, diastolic_data):
    # Combine input data into a single array
    X = np.array(date_data).reshape(-1, 1)
    y_systolic = np.array(systolic_data)
    y_diastolic = np.array(diastolic_data)

    # Standardize input features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y_systolic, y_diastolic

def train_model(X, y):
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a random forest regressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    return model

@app.route("/get-prediction")
def getPrediction():
    try:
        date_data = list(map(float, request.args.get('date').split(',')))
        systolic_data = list(map(float, request.args.get('systolic').split(',')))
        diastolic_data = list(map(float, request.args.get('diastolic').split(',')))
    except ValueError:
        return jsonify({"error": "Invalid input. Please provide comma-separated lists of numbers for 'date', 'systolic', and 'diastolic'."}), 400

    if len(date_data) != len(systolic_data) or len(date_data) != len(diastolic_data):
        return jsonify({"error": "Date, systolic, and diastolic data must have the same number of samples."}), 400

    # Preprocess the data
    X, y_systolic, y_diastolic = preprocess_data(date_data, systolic_data, diastolic_data)
    X, y_systolic, y_diastolic = preprocess_data(date_data, systolic_data, diastolic_data)

    # Train the model for systolic pressure
    model_systolic = train_model(X, y_systolic)

    # Train the model for diastolic pressure
    model_diastolic = train_model(X, y_diastolic)

    # Predict systolic and diastolic pressure
    systolic_pred = model_systolic.predict(X)
    diastolic_pred = model_diastolic.predict(X)

    # Calculate blood pressure
    blood_pressure = (systolic_pred / diastolic_pred).round(2)

    # Generate alerts
    alerts = [
        "Alert: Your Systolic Blood Pressure will be elevated." if systolic > 135.0 else ""
        for systolic in systolic_pred
    ]
    alerts += [
        "Alert: Your Diastolic Blood Pressure will be elevated." if diastolic > 85.0 else ""
        for diastolic in diastolic_pred
    ]

    return jsonify({
        "systolic_predictions": list(systolic_pred),
        "diastolic_predictions": list(diastolic_pred),
        "blood_pressure": list(blood_pressure),
        "alerts": [alert for alert in alerts if alert]  # Filter out empty alerts
    })

    try:
        date_data = list(map(float, request.args.get('date').split(',')))
        systolic_data = list(map(float, request.args.get('systolic').split(',')))
        diastolic_data = list(map(float, request.args.get('diastolic').split(',')))
    except ValueError:
        return jsonify({"error": "Invalid input. Please provide comma-separated lists of numbers for 'date', 'systolic', and 'diastolic'."}), 400

    if len(date_data) != len(systolic_data) or len(date_data) != len(diastolic_data):
        return jsonify({"error": "Date, systolic, and diastolic data must have the same number of samples."}), 400

    # Preprocess the data
    X, y_systolic, y_diastolic = preprocess_data(date_data, systolic_data, diastolic_data)

    # Train separate models for systolic and diastolic pressures
    model_systolic = train_model(X, y_systolic)
    model_diastolic = train_model(X, y_diastolic)

    # Predict systolic and diastolic pressures
    systolic_pred = model_systolic.predict(X)
    diastolic_pred = model_diastolic.predict(X)

    # Calculate blood pressure
    blood_pressure = (systolic_pred / diastolic_pred).round(2)

    # Generate alerts
    systolic_alerts = ["Alert: Your Systolic Blood Pressure will be elevated." if systolic > 135.0 else "" for systolic in systolic_pred]
    diastolic_alerts = ["Alert: Your Diastolic Blood Pressure will be elevated." if diastolic > 85.0 else "" for diastolic in diastolic_pred]

    return jsonify({
        "systolic_predictions": list(systolic_pred),
        "diastolic_predictions": list(diastolic_pred),
        "blood_pressure": list(blood_pressure),
        "systolic_alerts": [alert for alert in systolic_alerts if alert],
        "diastolic_alerts": [alert for alert in diastolic_alerts if alert]
    })


if __name__ == "__main__":
    app.run(debug=True)
