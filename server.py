from http.server import BaseHTTPRequestHandler, HTTPServer
from lib import requests, shortcuts
from app import urls
import webbrowser
from urllib.parse import unquote

port = 3030
address = "http://127.0.0.1:" + str(port)

class Server(BaseHTTPRequestHandler):
	def do_GET(self):
		self.send({
			"method": "GET"
		})

	def do_POST(self):
		content_len = int(self.headers.get('Content-Length'))
		post_body = self.rfile.read(content_len).decode("utf-8") 
		self.send({
			"method": "POST",
			"body": requests.parse_url(post_body)
		})
	
	def send(self, data = {}):
		originalUrl = unquote(self.path)
		
		path = unquote(self.path) #without the query
		if("?" in path):
			path = path.split("?")[0]

		if(path in urls.paths):
			query = requests.parse_url(originalUrl)

			ob = {
				"originalUrl": originalUrl,
				"path": path,
				"query": query,
				"headers": self.headers,
			}
			for key in data:
				ob[key] = data[key]

			response = urls.paths[path](ob)
		else:
			response = shortcuts.render(path)

		if(response == None):
			response = {
				"headers": {},
				"status": 404
			}

		if("status" in response):
			self.send_response(response["status"])
		else:
			self.send_response(404)
		if("headers" in response):
			for key in response["headers"]:
				self.send_header(key, response["headers"][key])

		self.end_headers()
		data = ""
		if("data" in response):
			data = response["data"]
		try:
			data = data.encode()
		except(UnicodeDecodeError, AttributeError):
			#Bytes like object (images). Can't be encoded
			pass
		try:
			self.wfile.write(data)
		except Exception as e:
			print("Couldn't return the response:")
			print(e)
			print()

	def log_message(self, format, *args):
		return
	
	@classmethod
	def post_start(cls):
		#Callback for the server start
		print()
		print("SSH Client hosted on " + address)
		print()
		webbrowser.open(address)

class CallbackHTTPServer(HTTPServer):

    def server_activate(self):
        HTTPServer.server_activate(self)
        self.RequestHandlerClass.post_start()

def run():
	webServer = CallbackHTTPServer(("localhost", port), Server)
	try:
		webServer.serve_forever()
	except KeyboardInterrupt:
		webServer.server_close()

run()