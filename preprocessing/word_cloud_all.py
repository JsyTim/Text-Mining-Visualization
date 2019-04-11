import csv
import pandas
path = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/MovieAnalysis/MovieAnalysis/"
movies = path + 'movies.csv'
movie_countries = path + 'movie_countries.csv'
movieIdWithCountry = path + 'moviesIdWithCountry.csv'
geojson = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/country.geo.json"
movie_actors = path + 'movie_actors.csv'
movie_directors = path + 'movie_directors.csv'
movie_genres = path + 'movie_genres.csv'
movie_word_cloud = path + 'movie_word_cloud.csv'
json_path = path + 'word_cloud_all.json'
def create_actorsDict():
    with open(movie_actors, 'r', encoding="utf-8_sig") as movie_actors_reader:
        movie_actors_rows = csv.reader(movie_actors_reader)
        next(movie_actors_rows, None)
        mid_list = []
        for row in movie_actors_rows:
            mid = row[0]
            mid_list.append(mid)
        sorted_mid_list = {}.fromkeys(mid_list).keys()

        actorsById = locals()
        for i in sorted_mid_list:
            actorsById[str(i)] = []

        movie_actors_reader.seek(0)
        next(movie_actors_rows, None)
        for row in movie_actors_rows:
            mid = row[0]
            actorId = row[1]
            actorName = row[2]
            actorsById[str(mid)].append(actorName)

        actors_dict = {}
        for i in sorted_mid_list:
            actors_dict[i] = actorsById[str(i)]
        movie_actors_reader.close()
    return actors_dict
# create_actorsDict()

def create_genresDict():
    with open(movie_genres, 'r', encoding="utf-8_sig") as movie_genres_reader:
        movie_genres_rows = csv.reader(movie_genres_reader)
        next(movie_genres_rows, None)

        mid_list = []
        for row in movie_genres_rows:
            mid = row[0]
            mid_list.append(mid)
        sorted_mid_list = {}.fromkeys(mid_list).keys()

        # genres_list = []
        # for row in movie_genres_rows:
        #     genr = row[1]
        #     genres_list.append(genr)
        # sorted_genres_list = {}.fromkeys(genres_list).keys()
        # print(len(sorted_genres_list))
        # print(sorted_genres_list)

        genresById = locals()
        for i in sorted_mid_list:
            genresById[str(i)] = []

        movie_genres_reader.seek(0)
        next(movie_genres_rows, None)
        for row in movie_genres_rows:
            mid = row[0]
            genresName = row[1]
            genresById[str(mid)].append(genresName)

        genres_dict = {}
        for i in sorted_mid_list:
            genres_dict[i] = genresById[str(i)]
        movie_genres_reader.close()
    # return genres_dict
create_genresDict()

def create_directorsDict():
    with open(movie_directors, 'r', encoding="utf-8_sig") as movie_directors_reader:
        movie_directors_rows = csv.reader(movie_directors_reader)
        next(movie_directors_rows, None)

        dir_dict = {}
        for row in movie_directors_rows:
            mid = row[0]
            did = row[1]
            dname = row[2]
            dir_dict[mid] = did

    movie_directors_reader.close()
    return dir_dict

# create_directorsDict()

def create_allDict():
    a_dict = create_actorsDict()
    g_dict = create_genresDict()
    d_dict = create_directorsDict()

    with open(movieIdWithCountry, 'r', encoding="utf-8_sig") as movieIdWithCountry_reader:
        movieIdWithCountry_rows = csv.reader(movieIdWithCountry_reader)
        next(movieIdWithCountry_rows, None)
        all_dict = {}
        country_list = []
        year_list = []
        for row in movieIdWithCountry_rows:
            country = row[2]
            year = row[6]
            if len(year) != 4 or year == 'zulu':
                continue
            else:
                year_list.append(year)
            country_list.append(country)
        sorted_year_list = {}.fromkeys(year_list).keys()
        sorted_country_list = {}.fromkeys(country_list).keys()

        a_info = locals()
        g_info = locals()
        d_info = locals()

        countries = locals()
        for year in sorted_year_list:
            all_dict[year] = {}
            for country in sorted_country_list:
                all_dict[year][country] = {}
                a_info[year + country + 'actors'] = []
                g_info[year + country + 'genres'] = []
                d_info[year + country + 'directors'] = []

        movieIdWithCountry_reader.seek(0)
        next(movieIdWithCountry_rows, None)
        for row in movieIdWithCountry_rows:
            mid = row[0]
            country = row[2]
            year = row[6]
            if len(year) != 4 or year == 'zulu' :
                continue
            else:
                if mid not in a_dict.keys():
                    a_dict[mid] = []

                if mid not in g_dict.keys():
                    g_dict[mid] = []

                if mid not in d_dict.keys():
                    d_dict[mid] = []

                a_info[year + country + 'actors'].extend(a_dict[mid])
                g_info[year + country + 'genres'].extend(g_dict[mid])
                d_info[year + country + 'directors'].append(d_dict[mid])

        for year in sorted_year_list:
            for country in sorted_country_list:
                all_dict[year][country]['actors'] = a_info[year + country + 'actors']
                all_dict[year][country]['genres'] = g_info[year + country + 'genres']
                all_dict[year][country]['directors'] = d_info[year + country + 'directors']

        # print(len(all_dict['2000']['USA']['directors']))
        return all_dict
# create_allDict()

def write_json(json_file, data):
    with open(json_file, "w") as f:
        # data = "'65037': [{'name': 'based on novel', 'weight': '1'}, {'name': 'aspergers syndrome', 'weight': '1'}, {'name': 'autism', 'weight': '1'}, {'name': 'internet', 'weight': '1'}], '65126': [{'name': 'based on book', 'weight': '1'}, {'name': 'chuck palahniuk', 'weight': '1'}], '65130': [{'name': 'toplist08', 'weight': '1'}]"
        f.write(str(data))

# all_dict = create_allDict()
# write_json(json_path, all_dict)


