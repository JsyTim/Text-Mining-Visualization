import csv
path = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/MovieAnalysis/MovieAnalysis/"
json_path = path + 'region_concern.json'
movie_genres = path + 'movie_genres.csv'
movieIdWithCountry = path + 'moviesIdWithCountry.csv'
categories = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy','Crime','Documentary','Drama','Fantasy','Film-Noir','Horror','IMAX','Musical','Mystery','Romance','Sci-Fi', 'Thriller', 'War']

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
    return genres_dict
    # print(genres_dict['1'])
# create_genresDict()

def region_count():
    my_genres_dict = create_genresDict()
    # print(my_genres_dict)
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

        genr_zero = []
        for i in range(18):
            genr_zero.append(0)
        print(genr_zero)
        c_info = locals()
        gc_info = locals()
        regionMid = locals()
        for year in sorted_year_list:
            all_dict[year] = {}
            for country in sorted_country_list:
                # all_dict[year][country] = {}
                c_info[year + country + 'counts'] = 0
                gc_info[year + country + 'genrenums'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                regionMid[year + country + 'regionMid'] = []


        movieIdWithCountry_reader.seek(0)
        next(movieIdWithCountry_rows, None)
        for row in movieIdWithCountry_rows:
            mid = row[0]
            country = row[2]
            year = row[6]
            if len(year) != 4 or year == 'zulu':
                continue
            else:
                temp = c_info[year + country + 'counts']
                temp = temp + 1
                c_info[year + country + 'counts'] = temp
                regionMid[year + country + 'regionMid'].append(mid)

        # yr = ['1995', '1996']
        # country = 'USA'

        # ['Adventure', 'Animation', 'Children', 'Comedy', 'Fantasy']
        # ['Adventure', 'Children', 'Fantasy']
        # regionMid[year + country + 'regionMid'] = ['1', '2']

        # for year in yr:
        #     if len(regionMid[year + country + 'regionMid']) < 1:
        #         continue
        #     else:
        #         for mid in regionMid[year + country + 'regionMid']:
        #             # break
        #             sig_genre = []
        #             sig_genre = my_genres_dict[mid]
        #             # print(sig_genre)
        #             for sg in range(len(sig_genre)):  # check every need in day_need, if in, add its freq; else add 0
        #                 if sig_genre[sg] in categories:  # all_needs[need]: ['need']; all_needs[need][0]: need
        #                     index = categories.index(sig_genre[sg])
        #                     num1 = gc_info[year + country + 'genrenums'][index]
        #                     num1 += 1
        #                     gc_info[year + country + 'genrenums'][index] = num1
        #                     # print(num1)
        #                 print(gc_info['1995USAgenrenums'], gc_info['1998USAgenrenums'])
                    # print()
        # print(regionMid['1995USAregionMid'])
        # print(regionMid['1996USAregionMid'])

        # sig_country['genres_nums'] = gc_info[year + country + 'genrenums']
        # print(regionMid)
        print(len(sorted_year_list))
        print(len(sorted_country_list))
        for year in sorted_year_list:
            years = []
            for country in sorted_country_list:
                sig_country = {}
                sig_country['region_name'] = country
                sig_country['counts'] = c_info[year + country + 'counts']
                if len(regionMid[year + country + 'regionMid']) < 1:
                    gc_info[year + country + 'genrenums'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                else:
                    for mid in regionMid[year + country + 'regionMid']:
                        # print(mid)
                        # break
                        sig_genre = []
                        sig_genre = my_genres_dict[mid]
                        num1 = 0
                        for sg in range(len(sig_genre)):  # check every need in day_need, if in, add its freq; else add 0
                            if sig_genre[sg] in categories:  # all_needs[need]: ['need']; all_needs[need][0]: need
                                index = categories.index(sig_genre[sg])
                                num1 = gc_info[year + country + 'genrenums'][index]
                                num1 += 1
                                gc_info[year + country + 'genrenums'][index] = num1
                sig_country['genres_nums'] = gc_info[year + country + 'genrenums']
                years.append(sig_country)
            all_dict[year] = years

    # print(len(all_dict['1995']))
    # print(all_dict['1995'])
    # print(all_dict['1995'][0]['counts'])
    # print(all_dict['1995')
    return all_dict
region_count()

def write_json(json_file, data):
    with open(json_file, "w") as f:
        f.write(str(data))

all_dict = region_count()
write_json(json_path, all_dict)
#
#
# ticks = []
# for i in range(1903, 2011):
#     ticks.append(i)
# print(ticks)

