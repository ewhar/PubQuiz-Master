<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/quizes">
    <html>
        <head>
            <title>Quiz</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        </head>
        <body>
            <div class="jumbotron text-center">
                <h1>Beste Quiz der Welt</h1>
            </div>
                <ul>
                <xsl:for-each select="quiz">
                    <xsl:sort select="difficulty" order="ascending"></xsl:sort>
                    <li>Anzahl Fragen: <xsl:value-of select="amount"/></li>
                    <xsl:choose>
                        <xsl:when test="difficulty = 'easy'">
                            <li>Schwierigkeitsstufe: Einfach</li>
                        </xsl:when>
                        <xsl:when test="difficulty = 'medium'">
                            <li>Schwierigkeitsstufe: Mittel</li>
                        </xsl:when>
                        <xsl:when test="difficulty = 'hard'">
                            <li>Schwierigkeitsstufe: Schwer</li>
                        </xsl:when>
                        <xsl:otherwise>
                            <li>Keine Schwierigkeitsstufe ausgewählt</li>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="category = 9">
                            <li>Kategorie: General Knowledge</li>
                        </xsl:when>
                        <xsl:when test="category = 10">
                            <li>Kategorie: Entertainment: Books</li>
                        </xsl:when>
                        <xsl:when test="category = 11">
                            <li>Kategorie: Entertainment: Film</li>
                        </xsl:when>
                        <xsl:when test="category = 12">
                            <li>Kategorie: Entertainment: Music</li>
                        </xsl:when>
                        <xsl:when test="category = 13">
                            <li>Kategorie: Entertainment: Musicals &amp; Theatres</li>
                        </xsl:when>
                        <xsl:when test="category = 14">
                            <li>Kategorie: Entertainment: Television</li>
                        </xsl:when>
                        <xsl:when test="category = 15">
                            <li>Kategorie: Entertainment: Video Games</li>
                        </xsl:when>
                        <xsl:when test="category = 16">
                            <li>Kategorie: Entertainment: Board Games</li>
                        </xsl:when>
                        <xsl:when test="category = 17">
                            <li>Kategorie: Science &amp; Nature</li>
                        </xsl:when>
                        <xsl:when test="category = 18">
                            <li>Kategorie: Science: Computers</li>
                        </xsl:when>
                        <xsl:when test="category = 19">
                            <li>Kategorie: Science: Mathematics</li>
                        </xsl:when>
                        <xsl:when test="category = 20">
                            <li>Kategorie: Mythology</li>
                        </xsl:when>
                        <xsl:when test="category = 21">
                            <li>Kategorie: Sports</li>
                        </xsl:when>
                        <xsl:when test="category = 22">
                            <li>Kategorie: Geography</li>
                        </xsl:when>
                        <xsl:when test="category = 23">
                            <li>Kategorie: History</li>
                        </xsl:when>
                        <xsl:when test="category = 24">
                            <li>Kategorie: Politics</li>
                        </xsl:when>
                        <xsl:when test="category = 25">
                            <li>Kategorie: Art</li>
                        </xsl:when>
                        <xsl:when test="category = 26">
                            <li>Kategorie: Celebrities</li>
                        </xsl:when>
                        <xsl:when test="category = 27">
                            <li>Kategorie: Animals</li>
                        </xsl:when>
                        <xsl:when test="category = 28">
                            <li>Kategorie: Vehicles</li>
                        </xsl:when>
                        <xsl:when test="category = 29">
                            <li>Kategorie: Entertainment: Comics</li>
                        </xsl:when>
                        <xsl:when test="category = 30">
                            <li>Kategorie: Science: Gadgets</li>
                        </xsl:when>
                        <xsl:when test="category = 31">
                            <li>Kategorie: Entertainment: Japanese Anime &amp; Manga</li>
                        </xsl:when>
                        <xsl:when test="category = 32">
                            <li>Kategorie: Entertainment: Cartoon &amp; Animations</li>
                        </xsl:when>
                        <xsl:otherwise>
                            <li>Keine Kategorie ausgewählt</li>
                        </xsl:otherwise>
                    </xsl:choose>
                    <br></br>
                </xsl:for-each>
            </ul>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>