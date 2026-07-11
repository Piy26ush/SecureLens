import math
import re
from typing import List, Dict, Any, Set
from .data import SECURITY_KNOWLEDGE_BASE

# Standard English stopwords to clean text during tokenization
STOPWORDS: Set[str] = {
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
    'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
    'is', 'isnt', 'it', 'its', 'itself', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
    'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
    'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
}

def tokenize(text: str) -> List[str]:
    """
    Cleans, lowercases, and tokenizes text, removing common stopwords.
    """
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    words = cleaned.split()
    return [w for w in words if w not in STOPWORDS]

class VectorStoreVSM:
    """
    A pure-Python Vector Space Model (VSM) Database using TF-IDF and Cosine Similarity.
    Provides local semantic search without external native dependencies (ChromaDB/PyTorch).
    """
    def __init__(self, documents: List[Dict[str, Any]]):
        self.documents = documents
        self.doc_tokens = [tokenize(doc["document"]) for doc in documents]
        self.num_docs = len(documents)
        self.vocabulary: Set[str] = set()
        for tokens in self.doc_tokens:
            self.vocabulary.update(tokens)
        
        # Calculate Inverse Document Frequency (IDF) for all vocabulary terms
        self.idf: Dict[str, float] = {}
        for term in self.vocabulary:
            docs_with_term = sum(1 for tokens in self.doc_tokens if term in tokens)
            # Logarithmic smoothing IDF
            self.idf[term] = math.log(1 + (self.num_docs / (1 + docs_with_term)))

        # Build TF-IDF vector representations for each document
        self.doc_vectors: List[Dict[str, float]] = []
        self.doc_magnitudes: List[float] = []
        for tokens in self.doc_tokens:
            vector = self._compute_tfidf_vector(tokens)
            self.doc_vectors.append(vector)
            # Calculate magnitude (Euclidean norm) for cosine similarity calculation
            magnitude = math.sqrt(sum(val ** 2 for val in vector.values()))
            self.doc_magnitudes.append(magnitude)

    def _compute_tfidf_vector(self, tokens: List[str]) -> Dict[str, float]:
        """
        Computes term-frequency weights multiplied by inverse document frequency (TF-IDF).
        """
        tf: Dict[str, float] = {}
        for token in tokens:
            tf[token] = tf.get(token, 0.0) + 1.0
        
        vector: Dict[str, float] = {}
        for term, count in tf.items():
            if term in self.idf:
                vector[term] = count * self.idf[term]
        return vector

    def search(self, query: str, category_filter: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Filters documents by metadata category, converts query to vector, 
        and calculates cosine similarities to retrieve top_k documents.
        """
        query_tokens = tokenize(query)
        if not query_tokens:
            # Fallback: if query contains only stopwords, return category matches directly
            return [doc for doc in self.documents if doc.get("category") == category_filter][:top_k]

        query_vector = self._compute_tfidf_vector(query_tokens)
        query_magnitude = math.sqrt(sum(val ** 2 for val in query_vector.values()))
        
        if query_magnitude == 0:
            return [doc for doc in self.documents if doc.get("category") == category_filter][:top_k]

        results = []
        for i, doc in enumerate(self.documents):
            # Enforce metadata filtering (must match category)
            if doc.get("category") != category_filter:
                continue

            doc_vector = self.doc_vectors[i]
            doc_magnitude = self.doc_magnitudes[i]
            
            if doc_magnitude == 0:
                continue

            # Compute dot product
            dot_product = sum(query_vector[term] * doc_vector.get(term, 0.0) for term in query_vector)
            
            # Cosine similarity calculation
            similarity = dot_product / (query_magnitude * doc_magnitude)
            results.append((similarity, doc))

        # Sort matches by similarity score descending
        results.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in results[:top_k]]

# Instantiate the global vector database
db = VectorStoreVSM(SECURITY_KNOWLEDGE_BASE)

def retrieve_security_context(query: str, category: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Public query API used by the scanning pipeline to retrieve relevant OWASP context.
    """
    return db.search(query, category_filter=category, top_k=top_k)
