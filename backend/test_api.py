import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 50)
print("KScouts Backend Test")
print("=" * 50)

# Test 1: Health Check
print("\n[1] Testing Health Endpoint...")
try:
    r = requests.get(f"{BASE_URL}/health")
    print(f"    Status: {r.status_code}")
    print(f"    Response: {r.json()}")
except Exception as e:
    print(f"    ERROR: {e}")

# Test 2: Register
print("\n[2] Testing Registration...")
try:
    data = {
        "email": "testplayer@kscouts.com",
        "password": "test123",
        "full_name": "Test Player",
        "role": "player"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=data)
    print(f"    Status: {r.status_code}")
    print(f"    Response: {r.json()}")
    
    if r.status_code == 200:
        token = r.json().get("access_token")
        print(f"    Token (first 30 chars): {token[:30]}...")
    elif r.status_code == 400:
        print("    (User may already exist, trying login instead)")
except Exception as e:
    print(f"    ERROR: {e}")

# Test 3: Login
print("\n[3] Testing Login...")
try:
    data = {
        "email": "testplayer@kscouts.com",
        "password": "test123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"    Status: {r.status_code}")
    print(f"    Response: {r.json()}")
except Exception as e:
    print(f"    ERROR: {e}")

print("\n" + "=" * 50)
print("Test Complete!")
print("=" * 50)
