import twint

# Configure
c = twint.Config()
c.Username = "elonmusk"
c.Search = "tweets"

# Run
twint.run.Search(c)