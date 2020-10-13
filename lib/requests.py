from urllib.parse import unquote

def parse_url(url):
    if("?" in url):
        url = url.split("?")[1]
    fields = url.split("&")
    results = {}
    for field in fields:
        split = field.split("=")
        if(len(split) == 1):
            results[unquote(split[0]).replace("%20", " ")] = None
        else:
            results[unquote(split[0]).replace("%20", " ")] = unquote(split[1]).replace("%20", " ")
        
    return results