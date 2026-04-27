from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator

class User(models.Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True, index=True)
    email = fields.CharField(max_length=100, unique=True, index=True)
    hashed_password = fields.CharField(max_length=255)
    
    likes: fields.ReverseRelation["Like"]
    ratings: fields.ReverseRelation["Rating"]

    class Meta:
        table = "users"

class Movie(models.Model):
    id = fields.CharField(pk=True, max_length=20) # IMDB ID
    title = fields.CharField(max_length=255, index=True)
    overview = fields.TextField(null=True)
    poster_path = fields.CharField(max_length=255, null=True)
    release_date = fields.CharField(max_length=50, null=True)
    vote_average = fields.FloatField(default=0.0)
    vote_count = fields.IntField(default=0)
    popularity = fields.FloatField(default=0.0)
    
    genres: fields.ManyToManyRelation["Genre"] = fields.ManyToManyField(
        "models.Genre", related_name="movies", through="movie_genres"
    )
    likes: fields.ReverseRelation["Like"]
    ratings: fields.ReverseRelation["Rating"]

    class Meta:
        table = "movies"

class Genre(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50, unique=True)

    class Meta:
        table = "genres"

class Like(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="likes")
    movie = fields.ForeignKeyField("models.Movie", related_name="likes")

    class Meta:
        table = "likes"

class Rating(models.Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="ratings")
    movie = fields.ForeignKeyField("models.Movie", related_name="ratings")
    rating = fields.FloatField()

    class Meta:
        table = "ratings"
