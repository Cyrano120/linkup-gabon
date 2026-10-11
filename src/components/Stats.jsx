function Stats({ providers, openRequests, completedRequests }) {
  const availableProviders = providers.filter((provider) => provider.available)
  const averageRating =
    providers.reduce((total, provider) => total + provider.rating, 0) / providers.length
  const totalMissions = providers.reduce((total, provider) => total + provider.missions, 0)

  return (
    <section className="stats">
      <article>
        <span>Talents verifies</span>
        <strong>{availableProviders.length}</strong>
        <p>prets a intervenir</p>
      </article>
      <article>
        <span>Demandes actives</span>
        <strong>{openRequests.length}</strong>
        <p>en cours de traitement</p>
      </article>
      <article>
        <span>Note moyenne</span>
        <strong>{averageRating.toFixed(1)}/5</strong>
        <p>sur les prestataires</p>
      </article>
      <article>
        <span>Historique</span>
        <strong>{totalMissions + completedRequests.length}</strong>
        <p>missions referencees</p>
      </article>
    </section>
  )
}

export default Stats
