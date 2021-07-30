from locust import HttpUser, task, between

class SandboxSymfonyUser(HttpUser):
    wait_time = between(5, 9)

    @task
    def symfony_index_page(self):
        self.client.get("/symfony/app")
    
    def on_start(self):
        self.client.verify = False
