
import random
path = "G:/TTU/TTU 2019 Spring/CS4331_Visualization/Text-Mapping Visualization/data/MovieAnalysis/MovieAnalysis/"
json_path = path + 'region_concern.json'
def createData():
    random_count = []
    for i in range(180):
        rcount = random.randint(0, 100)
        random_count.append(rcount)
    region_concern = {}
    region_concern['features'] = []
    for i in range(180):
        sig_region = {}
        sig_region['dist_num'] = i
        sig_region['count'] = random_count[i]
        region_concern['features'].append(sig_region)
    print(region_concern)
    return region_concern
# createData()

def write_json(json_file, data):
    with open(json_file, "w") as f:
        f.write(str(data))
region_concern = createData()
write_json(json_path, region_concern)

# def read_json(json_file, data):
#     with open(json_file, "r") as f:
#
#         f.read(str(data))
# region_concern = createData()
# write_json(json_path, region_concern)
