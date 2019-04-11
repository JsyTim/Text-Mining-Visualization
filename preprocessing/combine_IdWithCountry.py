import csv
def combine_Id_with_country():
    with open(movieIdWithName, 'r', encoding='utf-8_sig') as movie_countries_reader:
        movie_countries_rows = csv.reader(movie_countries_reader)
        movieWithCountries = []
        # with open(movies, 'r', encoding="utf-8_sig") as movie_reader:
        #     movies_rows = csv.reader(movie_reader)
        #     movie_countries_rows = csv.reader(movie_countries_reader)
        #     movieWithCountries = []
        #     for movies_row in movies_rows:
        #         mid = movies_row[0]
        #         # print(mid)
        #         movieTitle = movies_row[1]
        #         movieYear = movies_row[5]
        #         data = []
        #         for movie_countries_row in movie_countries_rows:
        #             movieId = movie_countries_row[0]
        #             movieCountries = movie_countries_row[1]
        #             # print(mid, movieId)
        #             if mid == movieId:
        #                 data.append(mid)
        #                 data.append(movieTitle)
        #                 data.append(movieYear)
        #                 data.append(movieCountries)
        #                 movieWithCountries.append(data)
        #             break  # if id matched, stop searching
        # # print(movieWithCountries[1:])
        # movie_reader.close()
        for movie_countries_row in movie_countries_rows:
            feature = []
            movieId = movie_countries_row[0]
            movieTitle = movie_countries_row[1]
            movieCountries = movie_countries_row[2]
            movieYear = movie_countries_row[6]
            feature.append(movieId)
            feature.append(movieTitle)
            feature.append(movieCountries)
            feature.append(movieYear)
            movieWithCountries.append(feature)
    movie_countries_reader.close()
    # print(len(movieWithCountries))
    return movieWithCountries
combine_Id_with_country()