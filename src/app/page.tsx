'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function IntroPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // 第一部分：文字动画效果
    document.querySelectorAll('.animate-text').forEach((element) => {
      const textElement = element as HTMLElement
      const text = textElement.textContent?.trim() || ''
      textElement.setAttribute('data-text', text)

      ScrollTrigger.create({
        trigger: textElement,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1,
        onUpdate: (self) => {
          const clipValue = Math.max(0, 100 - self.progress * 100)
          textElement.style.setProperty('--clip-value', `${clipValue}%`)
        }
      })
    })

    // 第二部分：可信之源动画
    const servicesHeaders = document.querySelectorAll('.services-header')

    ScrollTrigger.create({
      trigger: '.services',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(servicesHeaders[0], { x: `${100 - self.progress * 100}%` })
        gsap.set(servicesHeaders[1], { x: `${-100 + self.progress * 100}%` })
        gsap.set(servicesHeaders[2], { x: `${100 - self.progress * 100}%` })
      }
    })

    ScrollTrigger.create({
      trigger: '.services',
      start: 'top top',
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      scrub: 1,
      pinSpacing: false,
      onUpdate: (self) => {
        if (self.progress <= 0.5) {
          const yProgress = self.progress / 0.5
          gsap.set(servicesHeaders[0], { y: `${yProgress * 100}%` })
          gsap.set(servicesHeaders[2], { y: `${yProgress * -100}%` })
        } else {
          gsap.set(servicesHeaders[0], { y: '100%' })
          gsap.set(servicesHeaders[2], { y: '-100%' })

          const scaleProgress = (self.progress - 0.5) / 0.5
          const minScale = window.innerWidth <= 1000 ? 0.3 : 0.1
          const scale = 1 - scaleProgress * (1 - minScale)

          servicesHeaders.forEach((header) => gsap.set(header, { scale }))
        }
      },
    })

    // 第三部分：功能模块滚动展示
    const sections = gsap.utils.toArray<HTMLElement>('.scroll-section')

    sections.forEach((section, i) => {
      const next = sections[i + 1]

      // 最后一屏结束后显示弹窗
      if (!next) {
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom center',
          end: 'bottom top',
          onEnter: () => {
            setTimeout(() => {
              setShowModal(true)
            }, 500)
          },
        })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      })

      tl.fromTo(
        section,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        },
        {
          opacity: 0,
          scale: 0.95,
          filter: 'blur(3px)',
          duration: 1.2
        }
      )

      tl.fromTo(
        next,
        {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(3px)',
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.2
        },
        0
      )

      const img = section.querySelector('.section-image')
      const text = section.querySelector('.section-text')

      if (img && text) {
        gsap.fromTo(
          img,
          { y: 30 },
          {
            y: -30,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        )

        gsap.fromTo(
          text,
          { y: -20 },
          {
            y: 20,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [router])

  const handleEnterHome = () => {
    setShowModal(false)
    router.push('/home')
  }

  const handleContinue = () => {
    setShowModal(false)
    const lastSection = document.querySelector('.scroll-section:last-child')
    if (lastSection) {
      lastSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sections = [
    {
      title: 'SBOM 清单分析',
      text: '自动生成并可视化项目依赖清单，为漏洞检测与合规分析提供基础。全面支持 npm、pip、go 等多种包管理器，深度解析依赖关系树。',
      img: '/images/sbom.png',
    },
    {
      title: '许可证合规检测',
      text: '智能识别许可证冲突与未声明风险，一键生成合规报告。支持主流开源许可证分析，降低法律合规风险。',
      img: '/images/license.png',
    },
    {
      title: '漏洞检测',
      text: '基于 CVE 数据库实时检测组件安全漏洞，提供精准修复建议。覆盖高中低风险等级，确保代码安全无虞。',
      img: '/images/vuln.png',
    },
    {
      title: '投毒风险监测',
      text: 'AI 模型持续监控依赖更新行为，识别潜在的供应链投毒风险。实时告警机制，保障软件供应链安全。',
      img: '/images/poison.png',
    },
    {
      title: '开发者画像',
      text: '生成可信开发者画像，分析团队贡献与安全信誉。深度洞察开发团队能力，助力人才评估与协作优化。',
      img: '/images/dev.png',
    },
  ]

  return (
    <div ref={containerRef} className="bg-[#0F111A] text-[#E5E7EB] overflow-hidden">
      {/* 第一部分：关于我们 */}
      <section className="about h-screen flex items-center justify-center px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F111A] via-[#1A1D2A] to-[#2A2E3D] opacity-80"></div>
        <h1 className="animate-text text-3xl lg:text-5xl font-bold text-center leading-tight relative z-10 max-w-4xl">
          构建可信的软件供应链安全体系。每个组件都经过深度分析，从依赖清单到安全评估，从合规检测到风险预警。
        </h1>
      </section>

      {/* 第二部分：可信之源 */}
      <section className="services h-screen relative flex flex-col justify-center items-center overflow-hidden">
        <div className="services-header w-full px-8 bg-[#0F111A] will-change-transform">
          <div className="text-6xl lg:text-8xl font-bold text-center text-[#3B82F6] py-8">
            可信之源
          </div>
        </div>
        <div className="services-header w-full px-8 bg-[#0F111A] will-change-transform z-20">
          <div className="text-6xl lg:text-8xl font-bold text-center text-[#60A5FA] py-8">
            可信之源
          </div>
        </div>
        <div className="services-header w-full px-8 bg-[#0F111A] will-change-transform">
          <div className="text-6xl lg:text-8xl font-bold text-center text-[#3B82F6] py-8">
            可信之源
          </div>
        </div>
      </section>

      {/* 第三部分：服务描述 */}
      <section className="services-copy min-h-screen flex items-center justify-center px-8 py-20">
        <h1 className="animate-text text-2xl lg:text-4xl font-bold text-center leading-relaxed max-w-6xl">
          我们致力于创建安全可靠的软件供应链分析平台。通过精准的依赖分析和智能风险评估，我们构建能够持久运行并提供安全保障的工作体系。
        </h1>
      </section>

      {/* 第四部分：功能模块展示 */}
      {sections.map((s, i) => (
        <section
          key={i}
          className="scroll-section h-screen flex items-center justify-center px-8 lg:px-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F111A] via-[#1A1D2A] to-[#2A2E3D] opacity-80"></div>

          <div className="flex flex-col lg:flex-row w-full max-w-7xl items-center gap-8 lg:gap-16 relative z-10">
            <div className="section-text flex-1 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#3B82F6] mb-6 leading-tight">
                {s.title}
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-2xl">
                {s.text}
              </p>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === i
                        ? 'bg-[#3B82F6] w-8'
                        : index < i
                          ? 'bg-[#60A5FA]'
                          : 'bg-[#2A2E3D]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="section-image flex-1 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
                <Image
                  src={s.img}
                  alt={s.title}
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl object-cover relative z-10 transform transition-transform duration-300 group-hover:scale-105"
                  priority={i === 0}
                />
              </div>
            </div>
          </div>

          {i < sections.length - 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
              <div className="text-gray-400 text-sm mb-2">继续滚动</div>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          )}
        </section>
      ))}

      {/* 确认弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D2A] border border-[#2A2E3D] rounded-2xl p-8 max-w-md w-full mx-auto transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-[#E5E7EB] mb-3">
                探索完成
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                您已经了解了平台的所有核心功能。现在可以进入首页开始使用，或者继续浏览介绍页面。
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 border border-[#2A2E3D] text-gray-400 rounded-lg hover:bg-[#2A2E3D] hover:text-gray-300 transition-all duration-200"
                >
                  继续浏览
                </button>
                <button
                  onClick={handleEnterHome}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  进入首页
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}