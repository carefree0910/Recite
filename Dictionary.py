import pickle


def dic():
    new_data = yield
    word, accent, meaning = new_data["word"], new_data["accent"], new_data["meaning"]
    if not word:
        print("Please don't send an empty word to the dictionary!")
    else:
        with open("dic.dat", "rb") as file:
            pack = pickle.load(file)

            pack["dictionary"][word] = {
                "accent": accent,
                "meaning": meaning
            }

            for i, data in enumerate(pack["list"]):
                length = len(pack["list"])
                if data["word"] == word:
                    pack["list"][i] = {
                        "word": word,
                        "accent": accent,
                        "meaning": meaning
                    }
                    pack["list"][length - 1], pack["list"][i] = pack["list"][i],  pack["list"][length - 1]
                    break
            else:
                pack["list"].append({
                    "word": word,
                    "accent": accent,
                    "meaning": meaning
                })
        with open("dic.dat", "wb") as file:
            pickle.dump(pack, file)


def print_dic():
    with open("dic.dat", "rb") as file:
        pack = pickle.load(file)
        print(pack["list"])
        print(pack["dictionary"])


def reset_dic():
    with open("dic.dat", "wb") as file:
        pickle.dump({
            "dictionary": {},
            "list": []
        }, file)


def rotate_list(idx):
    with open("dic.dat", "rb") as file:
        pack = pickle.load(file)
        lst, dictionary = pack["list"], pack["dictionary"]
        selected = lst.pop(idx)
        lst.append(selected)
    with open("dic.dat", "wb") as file:
        pickle.dump({
            "dictionary": dictionary,
            "list": lst
        }, file)


def find_word(word):
    with open("dic.dat", "rb") as file:
        dictionary = pickle.load(file)["dictionary"]
        try:
            return dictionary[word]
        except KeyError:
            return


def delete_word(word):
    if not word:
        print("Please delete a valid word!")
    else:
        with open("dic.dat", "rb") as file:
            pack = pickle.load(file)
            pack["dictionary"].pop(word, None)
            for i, data in enumerate(pack["list"]):
                if data["word"] == word:
                    pack["list"].pop(i)
                    break
        with open("dic.dat", "wb") as file:
            pickle.dump(pack, file)
