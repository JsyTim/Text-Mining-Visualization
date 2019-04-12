import math
import csv
import json

# Helper function
def build_dict(seq, key):
    return dict((d[key], dict(d, index=index)) for (index, d) in enumerate(seq))

allyear_movie = {}
movieID_title = {}
# Read all movies, and sort them according to years
# Build id-title dict
with open("../MovieAnalysis/movies.dat", encoding="ISO-8859-1") as tsvfile:
    reader = csv.DictReader(tsvfile, dialect='excel-tab')
    for row in reader:
        movie_id = int(row['id'])
        movie_year = int(row['year'])
        movie_title = row['title']
        movieID_title[movie_id] = movie_title
        if (movie_year in allyear_movie):
            allyear_movie[movie_year].append(movie_id)
        else:
            allyear_movie[movie_year] = []
            allyear_movie[movie_year].append(movie_id)
# print(allyear_movie)
# print(movieID_title)

allmovie_rated = {}
# Read all movies, and the rating
with open("../MovieAnalysis/user_ratedmovies-timestamps.dat", encoding="ISO-8859-1") as tsvfile:
    reader = csv.DictReader(tsvfile, dialect='excel-tab')
    for row in reader:
        movie_id = int(row['movieID'])
        movie_rating = float(row['rating'])
        if (movie_id in allmovie_rated):
            allmovie_rated[movie_id].append(movie_rating)
        else:
            allmovie_rated[movie_id] = []
            allmovie_rated[movie_id].append(movie_rating)
# print(allmovie_rated)

allmovie_averated = {}
# Calculate rating for each movie
for key, value in allmovie_rated.items():
    allrating = 0
    rating_num = 0
    averating = 0
    for rating in value:
        allrating += rating
        rating_num += 1
    if (rating_num != 0):
        averating = allrating/rating_num

    if(averating >= 5.0):
        averating = 5.0
    elif(averating >= 4.5):
        averating = 4.5
    elif(averating >= 4.0):
        averating = 4.0
    elif(averating >= 3.5):
        averating = 3.5
    elif(averating >= 3.0):
        averating = 3.0
    elif(averating >= 2.5):
        averating = 2.5
    elif(averating >= 2.0):
        averating = 2.0
    elif(averating >= 1.5):
        averating = 1.5
    elif(averating >= 1.0):
        averating = 1.0
    elif(averating >= 0.5):
        averating = 0.5
    elif(averating >= 0.0):
        averating = 0
    allmovie_averated[key] = averating
# print(len(allmovie_averated))

allgenre_movie = {}
genrelist = {}
genre_movieID = {}
# Read sort movie in genre
with open("../MovieAnalysis/movie_genres.dat", encoding="ISO-8859-1") as tsvfile:
    reader = csv.DictReader(tsvfile, dialect='excel-tab')
    for row in reader:
        movie_id = int(row['movieID'])
        genre = row['genre']
        genre_movieID[movie_id] = genre
        if (genre in genrelist):
            genrelist[genre].append(movie_id)
        else:
            genrelist[genre] = []
            genrelist[genre].append(movie_id)
# print(len(genrelist))
# print(genre_movieID)

allyear_movienet = {}
# Build year-movienet dict
for key, value in allyear_movie.items():
    # Build genre_movie in this year
    genre_movies = {}
    for movie in value:
        if (genre_movieID[movie] in genre_movies):
            genre_movies[genre_movieID[movie]].append(movie)
        else:
            genre_movies[genre_movieID[movie]] = []
            genre_movies[genre_movieID[movie]].append(movie)
    # print(genre_movies)

    # Build dataset for network
    allyear_movienet[key] = {"type": "force",
                             "categories":[
                                 {
                                    "name": "0-Star",
                                    "keyword":{}
                                 },
                                 {
                                    "name": "1-Star",
                                    "keyword":{}
                                 },
                                 {
                                    "name": "2-Star",
                                    "keyword":{}
                                 },
                                 {
                                    "name": "3-Star",
                                    "keyword":{}
                                 },
                                 {
                                    "name": "4-Star",
                                    "keyword":{}
                                 },
                                 {
                                    "name": "5-Star",
                                    "keyword":{}
                                 }
                             ],
                             "nodes":[],
                             "links":[]}
    # Create nodes
    for movie_id in value:
        if(movie_id in allmovie_averated):
            movie = {"name": movieID_title[movie_id],
                     "value": 1,
                     "category": math.floor(allmovie_averated[movie_id]),
                     "id": movie_id}
            allyear_movienet[key]["nodes"].append(movie)

    # print(allyear_movienet[key]["nodes"])

    # Create links
    for gen, mov in genre_movies.items():
        if (len(mov) > 1):
            i = 0
            while i < (len(mov) - 1):
                j = i + 1
                while j < (len(mov)):
                    sourcei = next((index for (index, d) in enumerate(allyear_movienet[key]["nodes"]) if d["id"] == mov[i]), None)
                    trageti = next((index for (index, d) in enumerate(allyear_movienet[key]["nodes"]) if d["id"] == mov[j]), None)
                    link = {"source":sourcei,
                            "target":trageti}
                    allyear_movienet[key]["links"].append(link)
                    j += 1
                i += 1
    # print(allyear_movienet[key]["links"])
#
with open("../data/movie-network.json", "w") as outfile:
    json.dump(allyear_movienet, outfile)
