from locust import HttpUser, task, between

class sandboxUser(HttpUser):
    wait_time = between(5, 9)

    @task
    def index_page(self):
        self.client.get("/")

    def on_start(self):
        self.client.verify = False
