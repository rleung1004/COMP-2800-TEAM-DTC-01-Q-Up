class Model:
    """
    Represents a model representation of the database being used by this system
    """
    def __init__(self, base, session, db):
        """
        Creates a model object.
        :param base:        a declarative-base that maps classes to the database
        :param session:     a session object that When we use sessions the data is stored in the the local machine as a cookie
        :param db:          a sqlAlchemy object that is used to control the SQLAlchemy integration to a Flask application
        """
        self.db = db
        self.session = session
        self.base = base

        # tables for the database use self.tablename = self.base.classes.tableName

