class ResponseBody:
    """
    The Response format for the backend that is sent to the frontend from the backend.
    """
    def __init__(self, code, msg, json_list):
        """
        Creates a ResponseBody object.
        :param code:        an int
        :param msg:         a str
        :param json_list:   a list
        """
        self.code = code
        self.msg = msg
        self.list = json_list

    def to_json(self):
        """
        Creates a dict of the code, message, and the list that is of json format.
        :return: the created dict
        """
        return {"Code": self.code, "Message": self.msg, "List": self.list}

