# Search bar

Image and text query

# Search result

Image group by product name

Click to enlarge the picture

Click the product to a google search for that product (it's probably on Amazon)

# Auth

Kinde - [It can be used with Firebase](https://kinde.com/blog/engineering/kinde-with-firebase/)

# Firestore

Store user and guest recently search image.

For guest, it only save the image, store up to 7 images in history pass that number and it will automatically called delete api to delete the oldest.

For user, it save both the image and the text and can store up to 70 queries.

# The application structure

1 page for search.

1 dynamic page for search result.

1 history page for user.

1 auth page (kinde)
