import urllib.request
import sys

url = "http://localhost:8000/accounts/test-connection/"

try:
    print(f"Attempting to connect to {url}...")
    response = urllib.request.urlopen(url)
    data = response.read().decode('utf-8')
    print(f"Connection successful! Response: {data}")
    print(f"Status code: {response.status}")
    print("Server is responding correctly.")
    sys.exit(0)
except Exception as e:
    print(f"Error connecting to server: {e}")
    print("Please check if the server is running and accessible.")
    sys.exit(1) 