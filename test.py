import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

token = "QFKdKWJHe9ir4doaKlPBFKpxl7JUGR14YMDa-wjcKQ18aw_0b2hZaRDypBoXKjHvKpU9eWzXuZf9eCnbupklyw=="
org = "sae"
url = "https://influxdb.endide.com"

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)

query_api = client.query_api()

query = """from(bucket: "sensors")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "measurement1")"""
tables = query_api.query(query, org="sae")

for table in tables:
  for record in table.records:
    print(record)

query_api = client.query_api()

query = """from(bucket: "sensors")
  |> range(start: -10m)
  |> filter(fn: (r) => r._measurement == "measurement1")
  |> mean()"""
tables = query_api.query(query, org="sae")

for table in tables:
    for record in table.records:
        print(record)
