import csv
path = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/MovieAnalysis/MovieAnalysis/"
tags = path + 'tags.csv'
tags_with_name = path + 'tags_with_name.csv'
movie_tags = path + 'movie_tags.csv'
movies = path + 'movies.csv'
json_path = path + 'tags_with_name.json'

def combine_id_with_name():
    with open(tags, 'r', encoding="utf-8_sig") as tags_reader:
        tags_rows = csv.reader(tags_reader)
        next(tags_rows, None)
        tags_data = {}
        for tags_row in tags_rows:
            tid = tags_row[0]
            tvalue = tags_row[1]
            tags_data[tid] = tvalue
    with open(movies, 'r', encoding="utf-8_sig") as movies_reader:
        movies_rows = csv.reader(movies_reader)
        next(movies_rows, None)
        movies_data = {}
        for movies_row in movies_rows:
            mid = movies_row[0]
            mtitle = movies_row[1]
            movies_data[mid] = mtitle
        with open(movie_tags, 'r', encoding="utf-8_sig") as movie_tags_reader:
            movie_tags_rows = csv.reader(movie_tags_reader)
            next(movie_tags_rows, None)
            with open(tags_with_name, 'w', newline="", encoding="utf-8_sig") as tags_with_name_writer:
                out_csv = csv.writer(tags_with_name_writer)
                for movie_tags_row in movie_tags_rows:
                    movieId = movie_tags_row[0]
                    tagId = movie_tags_row[1]
                    tagValue = tags_data[tagId]
                    title = movies_data[movieId]
                    movie_tags_row.append(tagValue)
                    movie_tags_row.append(title)
                    out_csv.writerow(movie_tags_row)
            tags_with_name_writer.close()
        movie_tags_reader.close()
    tags_reader.close()
# combine_id_with_name()

def generate_tag_dict():
    # sig_movie = generate_sig_movie_list()
    with open(tags_with_name, 'r', encoding="utf-8_sig") as tags_with_name_reader:
        tags_with_name_rows = csv.reader(tags_with_name_reader)
        mid_list = []
        for row in tags_with_name_rows:
            mid = row[0]
            mid_list.append(mid)
    tags_with_name_reader.close()
    sort_mid_list = {}.fromkeys(mid_list).keys()
    sig_movie = locals()
    sig = {}
    for i in sort_mid_list:
        sig_movie[str(i)] = []
        sig[str(i)] = []

    with open(tags_with_name, 'r', encoding="utf-8_sig") as tags_with_name_reader:
        tags_with_name_rows = csv.reader(tags_with_name_reader)
        for row in tags_with_name_rows:
            sig_tags_dict = {}
            mid = row[0]
            tid = row[1]
            twig = row[2]
            tval = row[3]
            sig_tags_dict["name"] = tval
            sig_tags_dict["weight"] = twig
            sig_movie[str(mid)].append(sig_tags_dict)
    tags_with_name_reader.close()

    for i in sort_mid_list:
        sig[str(i)] = sig_movie[str(i)]

    return sig
generate_tag_dict()

def write_json(json_file, data):
    with open(json_file, "w") as f:
        # data = "'65037': [{'name': 'based on novel', 'weight': '1'}, {'name': 'aspergers syndrome', 'weight': '1'}, {'name': 'autism', 'weight': '1'}, {'name': 'internet', 'weight': '1'}], '65126': [{'name': 'based on book', 'weight': '1'}, {'name': 'chuck palahniuk', 'weight': '1'}], '65130': [{'name': 'toplist08', 'weight': '1'}]"
        f.write(str(data))

sig = generate_tag_dict()
print(len(sig['1']))
write_json(json_path, sig)



