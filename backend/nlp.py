from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

texts = [
    "this lesson is good",
    "very helpful",
    "i love learning",
    "this is bad",
    "boring topic",
    "i hate this"
]

labels = [
    "positive",
    "positive",
    "positive",
    "negative",
    "negative",
    "negative"
]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

model = MultinomialNB()
model.fit(X, labels)

def analyze_text(text):
    return model.predict(vectorizer.transform([text]))[0]
