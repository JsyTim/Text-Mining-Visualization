import csv
path = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/MovieAnalysis/MovieAnalysis/"
network_json_path = path + 'network.json'
movie_actors = path + 'movie_actors.csv'
movie_directors = path + 'movie_directors.csv'
movie_genres = path + 'movie_genres.csv'
user_rated_time = path + 'user_ratedmovies-timestamps.csv'
movieIdWithCountry = path + 'moviesIdWithCountry.csv'

def createId_Name_Dict():
    with open(movieIdWithCountry, 'r', encoding="utf-8_sig") as movieIdWithCountry_reader:
        mid_name_rows = csv.reader(movieIdWithCountry_reader)
        next(mid_name_rows, None) # skip the header
        m_dict = {}
        for row in mid_name_rows:
            mid = row[0]
            mtitle = row[1]
            m_dict[mid] = mtitle
        print(m_dict['1'])
    movieIdWithCountry_reader.close()
    return m_dict

# calculate the avg rates and create the node
def rated_avg():
    with open(user_rated_time, 'r', encoding="utf-8_sig") as user_rated_time_reader:
        u_rated_rows = csv.reader(user_rated_time_reader)
        next(u_rated_rows, None)
        m_list = []
        for row in u_rated_rows:
            uid = row[0]
            mid = row[1]
            rating = row[2]
            m_list.append(mid)
        sorted_m_list = {}.fromkeys(m_list).keys() # remove duplicate factors
        # print(len(sorted_m_list))

        # create list
        avgs = locals()
        rates = locals()
        for i in sorted_m_list:
            rates[i] = []
            avgs[i] = []

        user_rated_time_reader.seek(0)
        next(u_rated_rows, None)
        for row in u_rated_rows:
            mid = row[1]
            rating = row[2]
            rates[mid].append(rating)

        # calculate avg rates to from movie_list( movie names without duplicated factors)
        for m in sorted_m_list:
            a_list = []
            a_list = rates[m]
            if len(a_list) > 1:
                sum = 0
                for i in range(len(a_list)):
                    sum = sum + float(a_list[i])
                avg = sum / len(a_list)
            else:
                avg = a_list[0]


            if float(avg) % 0.5 >= 0.25:
                avg = float(avg) - (float(avg) % 0.5) + 0.5
            else:
                avg = float(avg) - (float(avg) % 0.5)
            avgs[m] = avg

    user_rated_time_reader.close()

    # create nodes
    name_dict = createId_Name_Dict()
    node = []
    for mid in sorted_m_list:
        sig_node = {}
        sig_node['name'] = name_dict[mid]
        sig_node['value'] = 1
        sig_node['category'] = avgs[mid]
        node.append(sig_node)
    # print(node[0])
rated_avg()

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

# get actor freq by year
def create_testDict():
    a_dict = create_actorsDict()

    with open(movieIdWithCountry, 'r', encoding="utf-8_sig") as movieIdWithCountry_reader:
        movieIdWithCountry_rows = csv.reader(movieIdWithCountry_reader)
        next(movieIdWithCountry_rows, None)  # skip the header
        all_dict = {}
        year_list = []
        for row in movieIdWithCountry_rows:
            year = row[6]
            if len(year) != 4 or year == 'zulu':  # skip the blank or wrong data
                continue
            else:
                year_list.append(year)
        sorted_year_list = {}.fromkeys(year_list).keys()  # remove duplicate factors

        a_info = locals()  # create list in batches
        for year in sorted_year_list:
            all_dict[year] = {}
            a_info[year + 'actors'] = [] # store actors by different year

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
                a_info[year + 'actors'].extend(a_dict[mid])

        for year in sorted_year_list:
            # for country in sorted_country_list:
            all_dict[year]['actors'] = a_info[year + 'actors']

        # Following code is test the actors frequency in the year of 2009;
        # It should be change to a year loop
        ac_year = all_dict['2009']['actors']
        sorted_ac_year_list = {}.fromkeys(ac_year).keys()  # remove duplicate actor name

        # method one to calculate freq
        # ac = Counter(ac_year)
        # print(ac.most_common(64))
        # print(ac.items())
        # print(len(all_dict['2009']['actors']))

        # method two to calculate freq
        dic = {}
        for word in ac_year:
            if word not in dic:
                dic[word] = 1
            else:
                dic[word] = dic[word] + 1
        # print(dic)
        # count = 0
        for acName in sorted_ac_year_list:
            if dic[acName] <= 1:
                continue
            # else:
                # print(acName, dic[acName])
                # count+=1
        # print(count)
        return all_dict
create_testDict()

# def actorByYear():
#     from collections import Counter
#     with open(movie_actors, 'r', encoding='utf-8_sig') as ma_reader:
#         ma_rows = csv.reader(ma_reader)
#         ma_list = []
#         for row in ma_rows:
#             ma = row[1]
#             ma_list.append(ma)
#         # print(len(ma_list))
#         ma_c = Counter(ma_list)
#         print(ma_c.most_common(30000))
# # actorByYear()


#  wanted to create movie_dict by year( not finish)
def movie_by_year():
    with open(user_rated_time, 'r', encoding="utf-8_sig") as user_rated_time_reader:
        u_rated_rows = csv.reader(user_rated_time_reader)
        next(u_rated_rows, None)
        m_list = []
        for row in u_rated_rows:
            uid = row[0]
            mid = row[1]
            rating = row[2]
            m_list.append(mid)
        sorted_m_list = {}.fromkeys(m_list).keys()
    user_rated_time_reader.close()
    print(sorted_m_list)

    with open(movieIdWithCountry, 'r', encoding="utf-8_sig") as movieIdWithCountry_reader:
        mwc_rows = csv.reader(movieIdWithCountry_reader)
        next(movieIdWithCountry_reader, None)

        for row in mwc_rows:
            mid = row[0]
            mtitle = row[1]
            year = row[6]
            if len(year) != 4 or year == 'zulu':
                continue
            # else:

movie_by_year()

## idea:
# step 1: create movie name list by year
# {year1: {movieA:[], movieB:[], movieC:[]},
#  year2: {movieA:[], movieB:[], movieC:[]},

# step2: add actors according to movies:
#   movieA: [actorsA, actorsB, actorsC...]

# step3: create for loop in year1 to check every movie
# if actors in one of the list:
# 	get the movie name
# 	add movie name in to actors{list}
# actorA {movieA, movieB, movieC, movieD}
# It means actorA shown 4 times in this year and the movieA, B, C, D have connections mutually.

