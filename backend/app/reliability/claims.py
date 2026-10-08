from sentence_transformers import SentenceTransformer, util


model = SentenceTransformer("all-MiniLM-L6-v2")


def extract_claims(answer: str) -> list[str]:
    """Split an answer into simple sentence-level claims."""

    if not answer:
        return []

    claims = [
        sentence.strip()
        for sentence in answer.replace("\n", " ").split(".")
        if sentence.strip()
    ]

    return claims


def cluster_claims(
    claims: list[str],
    threshold: float = 0.75,
) -> list[list[str]]:
    """Group semantically similar claims."""

    if not claims:
        return []

    embeddings = model.encode(claims, convert_to_tensor=True)

    clusters = []

    for index, claim in enumerate(claims):
        placed = False

        for cluster in clusters:
            representative = cluster[0]
            representative_index = claims.index(representative)

            similarity = util.cos_sim(
                embeddings[index],
                embeddings[representative_index],
            ).item()

            if similarity >= threshold:
                cluster.append(claim)
                placed = True
                break

        if not placed:
            clusters.append([claim])

    return clusters


def extract_and_cluster_claims(
    answers: list[str],
    threshold: float = 0.75,
) -> list[list[str]]:
    """Extract claims from multiple answers and cluster them."""

    all_claims = []

    for answer in answers:
        all_claims.extend(extract_claims(answer))

    return cluster_claims(all_claims, threshold)