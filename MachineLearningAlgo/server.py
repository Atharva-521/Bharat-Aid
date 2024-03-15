from flask import Flask, request, jsonify
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

def preprocess_data(date_data, systolic_data, diastolic_data):
    # Combine input data into a single array
    X = np.array(date_data).reshape(-1, 1)
    X = np.hstack((X, np.array(systolic_data).reshape(-1, 1)))

    # Standardize input features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, np.array(diastolic_data)

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
        length = date_data[len(date_data) - 1]
        week = list()
        for i in range(1, 8):
            week.append( length + float(i))
        print(date_data)
        systolic_data = list(map(float, request.args.get('systolic').split(',')))
        diastolic_data = list(map(float, request.args.get('diastolic').split(',')))
    except ValueError:
        return jsonify({
            "error": "Invalid input. Please provide comma-separated lists of numbers for 'date', 'systolic', and 'diastolic'."}), 400

    if len(date_data) != len(systolic_data) or len(date_data) != len(diastolic_data):
        return jsonify({"error": "Date, systolic, and diastolic data must have the same number of samples."}), 400

    # Preprocess the data
    X, y = preprocess_data(date_data, systolic_data, diastolic_data)

    # Train the model
    model = train_model(X, y)

    # Predict diastolic pressure

    diastolic_pred = model.predict(X)

    # Calculate blood pressure
    systolic_pred = np.array(systolic_data)
    blood_pressure = (systolic_pred / diastolic_pred).round(2)

    # Generate alerts
    alerts = ["Alert: Your Systolic Blood Pressure will be elevated." if systolic > 135.0 else "" for systolic in systolic_data]
    alerts += ["Alert: Your Diastolic Blood Pressure will be elevated." if diastolic > 85.0 else "" for diastolic in diastolic_pred]

    return jsonify({
        "systolic_predictions": list(systolic_pred),
        "diastolic_predictions": list(diastolic_pred),
        "blood_pressure": list(blood_pressure),
        "alerts": [alert for alert in alerts if alert]  # Filter out empty alerts
    })

if __name__ == "__main__":
    app.run(debug=True)
