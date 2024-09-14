from django.test import TestCase

import redis

r = redis.Redis(host='127.0.0.1', port=6379, db=0)
try:
    print(r.ping())
except redis.exceptions.ConnectionError as e:
    print(f"Connection error: {e}")
