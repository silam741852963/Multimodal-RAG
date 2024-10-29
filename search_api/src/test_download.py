import requests

# URL of the image
image_url = "https://m.media-amazon.com/images/I/41w2yznfuZL._SS40_.jpg"

# Send a request to the URL to download the image content
response = requests.get(image_url)

# Save the image locally
image_path = "amazon_image.jpg"
with open(image_path, 'wb') as file:
    file.write(response.content)

print(f"Image successfully downloaded and saved as {image_path}")
