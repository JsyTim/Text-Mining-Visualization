import csv
import json

allyear_movie = {}
# Read all movies, and sort them according to years
with open("../MovieAnalysis/movies.dat", encoding="ISO-8859-1") as tsvfile:
    reader = csv.DictReader(tsvfile, dialect='excel-tab')
    for row in reader:
        movie_id = int(row['id'])
        movie_year = int(row['year'])
        if (movie_year in allyear_movie):
            allyear_movie[movie_year].append(movie_id)
        else:
            allyear_movie[movie_year] = []
            allyear_movie[movie_year].append(movie_id)
# print(allyear_movie)

movie_actors = {}
# Read all movie_actors, and sort actor name according to movies
with open("../MovieAnalysis/movie_actors.dat", encoding="ISO-8859-1") as tsvfile:
    reader = csv.DictReader(tsvfile, dialect='excel-tab')
    for row in reader:
        movie_id = int(row['movieID'])
        actor_name = row['actorName']

        if (movie_id in movie_actors):
            movie_actors[movie_id].append(actor_name)
        else:
            movie_actors[movie_id] = []
            movie_actors[movie_id].append(actor_name)
# print(movie_actors)

allyear_actors = {}
# Build year-actor_names dict
for key, value in allyear_movie.items():
    allyear_actors[key] = []
    for movie_id in value:
        if(movie_id in movie_actors):
            actor_name = movie_actors[movie_id]
            allyear_actors[key].extend(movie_actors[movie_id])
# print(allyear_actors[1903])

# Build empty data for missing year
for i in range(1900, 2012):
    if (i not in allyear_actors):
        allyear_actors[i] = []
        # print(i, allyear_actors[i])

allyear_actors_weight = {}
# Calculate weighted actor
for key, value in allyear_actors.items():
    allyear_actors_weight[key] = []
    actorlist = {}
    for actor in value:
        if actor in actorlist:
            actorlist[actor]["weight"] += 1
        else:
            actorlist[actor] = {"name":actor, "weight":1}
    # print(actorlist);
    for weight_actor in actorlist:
        allyear_actors_weight[key].append(actorlist[weight_actor])
# print(allyear_actors_weight)

# with open("../data/actors-word.json", "w") as outfile:
#     json.dump(allyear_actors_weight, outfile)
