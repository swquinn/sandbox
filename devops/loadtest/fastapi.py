from locust import HttpUser, task, between

class SandboxFastapiUser(HttpUser):
    wait_time = between(5, 9)

    @task
    def fastapi_index_page(self):
        self.client.get("/fastapi/app")
    
    def on_start(self):
        self.client.verify = False
