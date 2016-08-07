import tkinter as tk

from Dictionary import *


class GUI(tk.Frame):

    @staticmethod
    def gen_show_hide_button(frame, pack):
        return tk.Button(frame, width=2, bd=0, command=GUI.show_hide_info(pack), text="...")

    def gen_confirm_del_button(self, category, frame, pack):
        if category == "delete":
            return tk.Button(frame, image=self.del_icon, bd=0, command=self.do_confirm_del("delete", pack))
        else:
            return tk.Button(frame, image=self.confirm_icon, bd=0, command=self.do_confirm_del(category, pack))

    def gen_recite_word(self):
        return tk.Label(self.recite_frame, width=18)

    def gen_recite_accent(self):
        return tk.Label(self.recite_frame, width=4)

    def gen_recite_meaning(self):
        return tk.Label(self.recite_frame, width=24)

    @staticmethod
    def gen_recite_pack(target):
        return {
            "target": target,
            "message": ""
        }

    def gen_recite_controller(self, target):
        return GUI.gen_show_hide_button(self.recite_frame, target)

    def gen_recite_confirm(self, idx, word, accent, meaning):
        return self.gen_confirm_del_button("confirm", self.recite_frame, {
            "idx": idx,
            "word": word,
            "accent": accent,
            "meaning": meaning
        })

    def gen_recite_del(self, idx, word, accent, meaning):
        return self.gen_confirm_del_button("delete", self.recite_frame, {
            "idx": idx,
            "word": word,
            "accent": accent,
            "meaning": meaning
        })

    def __init__(self):

        # ==============================================================================================================
        # Initialize Frame

        tk.Frame.__init__(self)
        self.master.title("Recite!")

        self.wrapper_frame = tk.LabelFrame()
        self.recite_frame = tk.LabelFrame(self.wrapper_frame, text="Recite here!")
        self.add_frame = tk.LabelFrame(self.wrapper_frame, text="Add new word here!")
        self.check_frame = tk.LabelFrame(self.wrapper_frame, text="Check word here!")

        self.wrapper_frame.grid()
        self.recite_frame.grid(row=0, columnspan=2)
        self.add_frame.grid(row=1, columnspan=2)
        self.check_frame.grid(row=2, column=0)

        self.recite_num = 3

        # ==============================================================================================================
        # Initialize Icons

        self.search_icon = tk.PhotoImage(file="Icons/search.png")
        self.confirm_icon = tk.PhotoImage(file="Icons/confirm.png")
        self.del_icon = tk.PhotoImage(file="Icons/del.png")
        self.logo_pic = tk.PhotoImage(file="Pictures/logo.png")

        # ==============================================================================================================
        # Initialize Details

        # Recite Frame
        self.recite_words = []

        self.recite_accents = []
        self.recite_accent_packs = []
        self.recite_accent_controllers = []

        self.recite_meanings = []
        self.recite_meaning_packs = []
        self.recite_meaning_controllers = []

        self.recite_confirms = []
        self.recite_deletes = []

        for i in range(self.recite_num):
            word = self.gen_recite_word()
            self.recite_words.append(word)

            accent = self.gen_recite_accent()
            accent_pack = GUI.gen_recite_pack(accent)
            accent_controller = self.gen_recite_controller(accent_pack)

            self.recite_accents.append(accent)
            self.recite_accent_packs.append(accent_pack)
            self.recite_accent_controllers.append(accent_controller)

            meaning = self.gen_recite_meaning()
            meaning_pack = GUI.gen_recite_pack(meaning)
            meaning_controller = self.gen_recite_controller(meaning_pack)

            self.recite_meanings.append(meaning)
            self.recite_meaning_packs.append(meaning_pack)
            self.recite_meaning_controllers.append(meaning_controller)

            confirm = self.gen_recite_confirm(i, word, accent, meaning)
            delete = self.gen_recite_del(i, word, accent, meaning)

            self.recite_confirms.append(confirm)
            self.recite_deletes.append(delete)

            word.grid(row=i, column=0)
            accent.grid(row=i, column=1)
            accent_controller.grid(row=i, column=2)
            meaning.grid(row=i, column=3)
            meaning_controller.grid(row=i, column=4)

            confirm.grid(row=i, column=5)
            delete.grid(row=i, column=6)

        self.refresh_recite()

        # Add Frame
        self.add_word_label = tk.Label(self.add_frame, text="Word: ")
        self.add_word = tk.Entry(self.add_frame, width=18)

        self.add_accent_label = tk.Label(self.add_frame, text="Accent: ")
        self.add_accent = tk.Entry(self.add_frame, width=4)

        self.add_meaning_label = tk.Label(self.add_frame, text="Meaning: ")
        self.add_meaning = tk.Entry(self.add_frame, width=18)

        self.add_confirm = self.gen_confirm_del_button("modify", self.add_frame, {
            "word": self.add_word,
            "accent": self.add_accent,
            "meaning": self.add_meaning
        })

        self.add_word_label.grid(row=0, column=0)
        self.add_word.grid(row=0, column=1)
        self.add_accent_label.grid(row=0, column=2)
        self.add_accent.grid(row=0, column=3)
        self.add_meaning_label.grid(row=0, column=4)
        self.add_meaning.grid(row=0, column=5)

        self.add_confirm.grid(row=0, column=6)

        # Check Frame
        self.check_word_label = tk.Label(self.check_frame, text="Word: ")
        self.check_word = tk.Entry(self.check_frame, width=18)

        self.check_accent_label = tk.Label(self.check_frame, text="Accent: ")
        self.check_meaning_label = tk.Label(self.check_frame, text="Meaning: ")

        self.check_accent = tk.Entry(self.check_frame, width=4)
        self.check_meaning = tk.Entry(self.check_frame, width=18)

        self.check_search = tk.Button(self.check_frame, image=self.search_icon, bd=0,
                                      command=GUI.do_search(self.check_word, self.check_accent, self.check_meaning))
        self.check_confirm = self.gen_confirm_del_button("modify", self.check_frame, {
            "word": self.check_word,
            "accent": self.check_accent,
            "meaning": self.check_meaning
        })
        self.check_del = self.gen_confirm_del_button("delete", self.check_frame, {
            "word": self.check_word,
            "accent": self.check_accent,
            "meaning": self.check_meaning
        })

        self.check_word_label.grid(row=0, column=0)
        self.check_word.grid(row=0, column=1)

        self.check_search.grid(row=0, column=2)
        self.check_confirm.grid(row=0, column=3)
        self.check_del.grid(row=0, column=4)

        self.check_meaning_label.grid(row=1, column=0)
        self.check_meaning.grid(row=1, column=1)
        self.check_accent_label.grid(row=1, column=2, columnspan=3)
        self.check_accent.grid(row=1, column=6)

        # Logo
        self.logo = tk.Button(self.wrapper_frame, image=self.logo_pic, width=130, bd=0)
        self.logo.grid(row=2, column=1)

        # Binding
        self.add_word.bind("<Return>", GUI.focus_and_select(self.add_accent))
        self.add_accent.bind("<Return>", GUI.focus_and_select(self.add_meaning))
        self.add_meaning.bind("<Return>", self.finish_add())

        # Initialize
        GUI.focus_and_select(self.add_word)()

    def refresh_recite(self):
        with open("dic.dat", "rb") as file:
            lst = pickle.load(file)["list"]
            for i in range(self.recite_num):
                if i < len(lst):
                    data = lst[i]
                    self.recite_words[i]["text"] = data["word"]
                    self.recite_accent_packs[i]["message"] = data["accent"]
                    self.recite_meaning_packs[i]["message"] = data["meaning"]
                else:
                    self.recite_words[i]["text"] = ""
                    self.recite_accent_packs[i]["message"] = ""
                    self.recite_meaning_packs[i]["message"] = ""

    @staticmethod
    def show_hide_info(pack):
        def sub():
            if pack["message"]:
                pack["target"]["text"] = pack["message"]
                pack["target"].grid()
                pack["message"] = ""
            else:
                pack["message"] = pack["target"]["text"]
                pack["target"]["text"] = ""
        return sub

    def do_confirm_del(self, category, pack):
        def sub():
            new_pack = {key: data["text"] if isinstance(data, tk.Label) else data.get()
                        for key, data in pack.items() if key != "idx"}
            if category == "confirm":
                rotate_list(pack["idx"])
                self.refresh_recite()
            elif category == "modify":
                try:
                    dictionary = dic()
                    dictionary.__next__()
                    dictionary.send(new_pack)
                except StopIteration:
                    pass
                finally:
                    self.refresh_recite()
            else:
                delete_word(new_pack["word"])
                self.refresh_recite()
        return sub

    def finish_add(self):
        def sub(event=""):
            self.do_confirm_del("modify", {
                "word": self.add_word,
                "accent": self.add_accent,
                "meaning": self.add_meaning
            })()
            GUI.focus_and_select(self.add_word)()
        return sub

    @staticmethod
    def do_search(target, accent, meaning):
        def sub():
            data = find_word(target.get())
            accent.delete(0, tk.END)
            meaning.delete(0, tk.END)
            if not data:
                accent.insert(0, "")
                meaning.insert(0, "Not Found...")
            else:
                accent.insert(0, data["accent"])
                meaning.insert(0, data["meaning"])
        return sub

    @staticmethod
    def focus_and_select(entry):
        def sub(event=""):
            entry.focus_set()
            entry.select_from(0)
            entry.select_to(tk.END)
        return sub
