<?xml version='1.0' encoding='UTF-8'?>
<!-- Style RSS so that it is readable. -->
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0"

  xmlns:rss="http://purl.org/rss/1.0/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	>

<xsl:template match='/rdf:RDF'>
	<html>
		<head>
			<title>RSS feed for <xsl:value-of select='rss:channel/rss:description'/></title>
			<style type='text/css'>

			body {
				font-family: verdana, sans-serif;
				font-size: 80%; line-height: 1.45em;
			}

			h1, h2 {
				font-size: 100%;
			}

			img {
				border: none;
			}
			</style>
		</head>
		<body>
			<xsl:if test='rss:image/*'>
				<p><img src='{rss:image/rss:url}' /></p>
			</xsl:if>

			<h1>RSS feed for <xsl:value-of select='rss:channel/rss:description'/></h1>

			<p>This is an RSS feed for
					<a href='{rss:channel/rss:link}'><xsl:value-of select='rss:channel/rss:title'/></a>.
					If you don't know what an RSS feed, read the
					<a href='http://www.nedbatchelder.com/site/whatisrss.html'>What's RSS?</a> page.
					This feed only includes the first paragraph from each posting, and strips
					out links and style information.  If you want to read the blog, use the
					<a href='http://blog.monstuff.com'>main blog</a> page.
			</p>

			<xsl:apply-templates select='rss:item' />

		</body>
	</html>
</xsl:template>

<xsl:template match='rss:item'>
	<h2>
		<a href='{rss:link}'>
			<xsl:value-of select='rss:title'/>
		</a>
	</h2>
	<p>
		<xsl:value-of select='rss:description'/>
		<xsl:text> </xsl:text>
		<a href='{rss:link}'>Read the blog entry</a>.
	</p>
</xsl:template>

</xsl:stylesheet>
